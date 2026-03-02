package com.dental.controller;

import com.dental.payload.response.GalleryImageResponse;
import com.dental.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class GalleryController {

    private final CloudinaryService cloudinaryService;

    @PostMapping(
            value = "/api/admin/gallery/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Map<String, Object>> uploadImage(
            @RequestPart("file") MultipartFile file,
            @RequestPart("treatmentName") String treatmentName
    ) throws IOException {
        String url = cloudinaryService.uploadTreatmentImage(file, treatmentName);
        Map<String, Object> body = new HashMap<>();
        body.put("secureUrl", url);
        body.put("treatmentName", treatmentName);
        return ResponseEntity.ok(body);
    }

    @GetMapping(value = "/api/gallery", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<String>> getGalleryImages(
            @RequestParam(value = "treatmentName", required = false) String treatmentName
    ) throws Exception {
        List<String> urls = cloudinaryService.fetchGalleryImages(treatmentName);
        return ResponseEntity.ok(urls);
    }

    @GetMapping(value = "/api/admin/gallery", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<GalleryImageResponse>> getGalleryImagesForAdmin(
            @RequestParam(value = "treatmentName", required = false) String treatmentName
    ) throws Exception {
        List<GalleryImageResponse> images = cloudinaryService.fetchGalleryImagesForAdmin(treatmentName);
        return ResponseEntity.ok(images);
    }

    @DeleteMapping("/api/admin/gallery")
    public ResponseEntity<Void> deleteGalleryImage(@RequestParam("publicId") String publicId) throws IOException {
        cloudinaryService.deleteImageByPublicId(publicId);
        return ResponseEntity.noContent().build();
    }
}

