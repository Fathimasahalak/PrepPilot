package com.sahala.interview_prep_bot.model;

public class QuestionRequest {
    private String role;
    private String level;
    private String company;
    private String topic;

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }
}