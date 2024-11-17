package com.example.ai;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api")
public class ContentFilterController {
    private final BehaviorModel model; // Ensure model is injected or initialized

    private final String[] blockedWords = {"inappropriate", "violence", "offensive"};
    private final String[] sensitiveFields = {"password", "credit card", "ssn"};

    private final Pattern[] blockedWordPatterns;
    private final Pattern[] sensitiveFieldPatterns;

    // Constructor injection of BehaviorModel
    @Autowired
    public ContentFilterController(BehaviorModel model) {
        this.model = model;
        this.blockedWordPatterns = compilePatterns(blockedWords);
        this.sensitiveFieldPatterns = compilePatterns(sensitiveFields);
    }

    private Pattern[] compilePatterns(String[] words) {
        return java.util.Arrays.stream(words)
                .map(word -> Pattern.compile("\\b" + Pattern.quote(word) + "\\b", Pattern.CASE_INSENSITIVE))
                .toArray(Pattern[]::new);
    }

    @PostMapping("/checkContent")
    public ResponseEntity<Map<String, Object>> checkContent(@RequestBody Map<String, String> request) {
        String content = request.getOrDefault("content", "").toLowerCase().trim();
        if (content.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Content cannot be empty"));
        }

        boolean isSafe = isContentSafe(content, blockedWordPatterns);
        Map<String, Object> response = new HashMap<>();
        response.put("safe", isSafe);
        return ResponseEntity.ok(response);
    }

    private boolean isContentSafe(String content, Pattern[] patterns) {
        for (Pattern pattern : patterns) {
            if (pattern.matcher(content).find()) {
                return false;
            }
        }
        return true;
    }

    @PostMapping("/checkAutofill")
    public ResponseEntity<Map<String, Object>> checkAutofill(@RequestBody Map<String, String> request) {
        String fieldType = request.getOrDefault("fieldType", "").toLowerCase().trim();
        String fieldValue = request.getOrDefault("fieldValue", "").toLowerCase().trim();
        if (fieldType.isEmpty() || fieldValue.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "FieldType and FieldValue are required"));
        }

        boolean protect = isSensitive(fieldType, sensitiveFieldPatterns) || isSensitive(fieldValue, sensitiveFieldPatterns);
        Map<String, Object> response = new HashMap<>();
        response.put("protect", protect);
        return ResponseEntity.ok(response);
    }

    private boolean isSensitive(String input, Pattern[] patterns) {
        for (Pattern pattern : patterns) {
            if (pattern.matcher(input).find()) {
                return true;
            }
        }
        return false;
    }
    @PostMapping("/analyzeBehavior")
    public ResponseEntity<Map<String, Object>> analyzeBehavior(@RequestBody BehaviorRequest request) {
        Map<String, Object> response = new HashMap<>();  // Use Object to allow mixed types
    
        // Verify that 'model' is instantiated and has a 'predict' method
        if (model == null) {
            response.put("error", "AI model not initialized.");  // Allows String as the value type
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    
        boolean isSuspicious = model.predict(request.getUrl(), request.getBehaviors());
        response.put("isSuspicious", isSuspicious);  // Allows Boolean as the value type
    
        return ResponseEntity.ok(response);
    }
}   

