package com.sahala.interview_prep_bot.controller;

import org.springframework.boot.json.BasicJsonParser;
import com.sahala.interview_prep_bot.model.QuestionRequest;
import com.sahala.interview_prep_bot.model.QuestionResponse;
import com.sahala.interview_prep_bot.service.GeminiService;
import org.springframework.web.bind.annotation.*;
import com.sahala.interview_prep_bot.model.AnswerRequest;
import com.sahala.interview_prep_bot.model.AnswerResponse;
import com.sahala.interview_prep_bot.model.Session;
import com.sahala.interview_prep_bot.model.QuestionAnswer;
import com.sahala.interview_prep_bot.repository.SessionRepository;
import com.sahala.interview_prep_bot.repository.QuestionAnswerRepository;
import com.sahala.interview_prep_bot.model.User;
import com.sahala.interview_prep_bot.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class QuestionController {

    private final GeminiService geminiService;
    private final BasicJsonParser jsonParser = new BasicJsonParser();
    private final SessionRepository sessionRepository;
    private final QuestionAnswerRepository questionAnswerRepository;
    private final UserRepository userRepository;

    public QuestionController(GeminiService geminiService,
                               SessionRepository sessionRepository,
                               QuestionAnswerRepository questionAnswerRepository,
                               UserRepository userRepository) {
        this.geminiService = geminiService;
        this.sessionRepository = sessionRepository;
        this.questionAnswerRepository = questionAnswerRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping("/generate-questions")
    public Map<String, Object> generateQuestions(@RequestBody QuestionRequest request) {

        User currentUser = getCurrentUser();

        Session session = new Session(request.getRole(), request.getLevel(),
                request.getCompany(), request.getTopic());
        session.setUser(currentUser);
        session = sessionRepository.save(session);

        String prompt = "Generate 5 interview questions for a " + request.getRole() +
                " with " + request.getLevel() + " experience, preparing for " +
                request.getCompany() + " interviews, focused on " + request.getTopic() +
                ". Match the typical question style and difficulty of " + request.getCompany() +
                "'s interview process. Reply ONLY in valid JSON format like this: " +
                "{\"questions\": [\"question1\", \"question2\"]}. Do not include markdown code fences or any extra text.";

        String rawResponse = geminiService.askGemini(prompt);

        try {
            Map<String, Object> parsed = jsonParser.parseMap(rawResponse);
            List<String> questions = (List<String>) parsed.get("questions");

            Map<String, Object> result = new java.util.HashMap<>();
            result.put("sessionId", session.getId());
            result.put("questions", questions);
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Gemini response: " + rawResponse, e);
        }
    }

    @PostMapping("/evaluate-answer")
    public AnswerResponse evaluateAnswer(@RequestBody AnswerRequest request) {

        String prompt = "Question: " + request.getQuestion() +
                "\nCandidate's answer: " + request.getUserAnswer() +
                "\nRate this answer from 1 to 10 and give 2-line feedback. " +
                "Reply ONLY in valid JSON format like this: {\"score\": 7, \"feedback\": \"...\"}. " +
                "Do not include markdown code fences or any extra text.";

        String rawResponse = geminiService.askGemini(prompt);

        try {
            Map<String, Object> parsed = jsonParser.parseMap(rawResponse);
            int score = ((Number) parsed.get("score")).intValue();
            String feedback = (String) parsed.get("feedback");

            Session session = sessionRepository.findById(request.getSessionId())
                    .orElseThrow(() -> new RuntimeException("Session not found"));

            QuestionAnswer qa = new QuestionAnswer(session, request.getQuestion(),
                    request.getUserAnswer(), score, feedback);
            questionAnswerRepository.save(qa);

            return new AnswerResponse(score, feedback);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Gemini response: " + rawResponse, e);
        }
    }

    @GetMapping("/sessions")
    public List<Map<String, Object>> getAllSessions() {
        User currentUser = getCurrentUser();
        List<Session> sessions = sessionRepository.findByUserId(currentUser.getId());

        return sessions.stream().map(session -> {
            Map<String, Object> sessionData = new java.util.HashMap<>();
            sessionData.put("id", session.getId());
            sessionData.put("role", session.getRole());
            sessionData.put("level", session.getLevel());
            sessionData.put("company", session.getCompany());
            sessionData.put("topic", session.getTopic());
            sessionData.put("createdAt", session.getCreatedAt());

            List<QuestionAnswer> qaList = questionAnswerRepository.findBySessionId(session.getId());
            sessionData.put("questionAnswers", qaList);

            return sessionData;
        }).collect(Collectors.toList());
    }
}