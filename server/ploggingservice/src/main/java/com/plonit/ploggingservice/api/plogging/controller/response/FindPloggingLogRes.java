package com.plonit.ploggingservice.api.plogging.controller.response;

import com.plonit.ploggingservice.common.enums.Type;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FindPloggingLogRes {

    private Long id;

    private Type type;

    private String place;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Long totalTime;

    private Double distance;

    private Double calorie;
    
    private String review;

    public FindPloggingLogRes(Long id, Type type, String place, LocalDateTime startTime, LocalDateTime endTime, Long totalTime, Double distance, Double calorie, String review) {
        this.id = id;
        this.type = type;
        this.place = place;
        this.startTime = startTime;
        this.endTime = endTime;
        this.totalTime = totalTime;
        this.distance = distance;
        this.calorie = calorie;
        this.review = review;
    }
}
