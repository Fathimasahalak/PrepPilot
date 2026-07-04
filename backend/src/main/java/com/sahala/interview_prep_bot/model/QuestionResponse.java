package com.sahala.interview_prep_bot.model;

import java.util.List;

public class QuestionResponse {
    private List<String> questions;

    public QuestionResponse(List<String> questions) {
        this.questions = questions;
    }

    public List<String> getQuestions() {
        return questions;
    }

    public void setQuestions(List<String> questions) {
        this.questions = questions;
    }
}