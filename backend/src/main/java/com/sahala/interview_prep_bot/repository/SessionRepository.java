package com.sahala.interview_prep_bot.repository;

import com.sahala.interview_prep_bot.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findByUserId(Long userId);
}