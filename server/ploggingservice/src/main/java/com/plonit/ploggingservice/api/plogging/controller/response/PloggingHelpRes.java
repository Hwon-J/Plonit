package com.plonit.ploggingservice.api.plogging.controller.response;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class PloggingHelpRes {
    
    private Double latitude;
    
    private Double longitude;
    
    private String place;
    
    private String image;
    
    private String context;
}
