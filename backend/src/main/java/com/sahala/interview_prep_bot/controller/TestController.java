/*package com.sahala.interview_prep_bot.controller;

import com.sahala.interview_prep_bot.service.GeminiService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    private final GeminiService geminiService;

    public TestController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @GetMapping("/test")
    public String test() {
        return geminiService.askGemini("Say hello in one sentence");
    }
}*/