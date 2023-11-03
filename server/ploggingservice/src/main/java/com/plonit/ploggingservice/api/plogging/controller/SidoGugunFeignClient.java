package com.plonit.ploggingservice.api.plogging.controller;

import com.plonit.ploggingservice.api.plogging.controller.response.SidoGugunCodeRes;
import com.plonit.ploggingservice.common.CustomApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "plonit-service")
public interface SidoGugunFeignClient {

    @GetMapping("/api/plonit-service/v1/sido/{sido-name}/{gugun-name}")
    CustomApiResponse<SidoGugunCodeRes> findSidoGugunCode(
            @PathVariable("sido-name") String sidoName,
            @PathVariable("gugun-name") String gugunName);
    
    
}