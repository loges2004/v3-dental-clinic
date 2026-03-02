package com.dental.payload.response;

public class GalleryImageResponse {

    private final String publicId;
    private final String url;
    private final String treatmentName;

    public GalleryImageResponse(String publicId, String url, String treatmentName) {
        this.publicId = publicId;
        this.url = url;
        this.treatmentName = treatmentName;
    }

    public String getPublicId() {
        return publicId;
    }

    public String getUrl() {
        return url;
    }

    public String getTreatmentName() {
        return treatmentName;
    }
}

