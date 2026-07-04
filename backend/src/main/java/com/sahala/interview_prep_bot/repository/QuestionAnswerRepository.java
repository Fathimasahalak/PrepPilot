package com.sahala.interview_prep_bot.repository;

import com.sahala.interview_prep_bot.model.QuestionAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuestionAnswerRepository extends JpaRepository<QuestionAnswer, Long> {
    List<QuestionAnswer> findBySessionId(Long sessionId);
}