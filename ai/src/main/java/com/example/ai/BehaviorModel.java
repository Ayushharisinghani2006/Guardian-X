package com.example.ai;

import org.springframework.stereotype.Service;

@Service
public class BehaviorModel {
    public boolean predict(String url, String behaviors) {
        // Mock behavior: mark URLs with "suspicious" as unsafe, others as safe
        return url.contains("suspicious") || behaviors.contains("unusual");
    }
}
