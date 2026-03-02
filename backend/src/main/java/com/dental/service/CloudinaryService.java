package com.dental.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Search;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import com.dental.payload.response.GalleryImageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    private static final String ROOT_FOLDER = "tender-clinic";

    public String uploadTreatmentImage(MultipartFile file, String treatmentName) throws IOException {
        String folderSlug = toFolderSlug(treatmentName);
        String folderPath = ROOT_FOLDER + "/" + folderSlug + "/";

        Map<String, Object> options = ObjectUtils.asMap(
                "folder", folderPath,
                "overwrite", false,
                "resource_type", "image"
        );

        @SuppressWarnings("unchecked")
        Map<String, Object> uploadResult =
                (Map<String, Object>) cloudinary.uploader().upload(file.getBytes(), options);

        String publicId = (String) uploadResult.get("public_id");

        // Always serve a transformed, optimized URL (w_800,q_auto) from the CDN
        return cloudinary.url()
                .secure(true)
                .transformation(new Transformation<>()
                        .width(800)
                        .quality("auto")
                        .crop("scale")
                )
                .generate(publicId);
    }

    public List<String> fetchGalleryImages(String treatmentName) throws Exception {
        String expression;
        if (treatmentName == null || treatmentName.isBlank()) {
            expression = String.format("folder:%s/*", ROOT_FOLDER);
        } else {
            String folderSlug = toFolderSlug(treatmentName);
            String folderPath = ROOT_FOLDER + "/" + folderSlug + "/";
            expression = String.format("folder:%s", folderPath);
        }

        Search search = cloudinary.search()
                .expression(expression)
                .maxResults(100)
                .sortBy("created_at", "desc");

        @SuppressWarnings("unchecked")
        Map<String, Object> result = (Map<String, Object>) search.execute();
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> resources =
                (List<Map<String, Object>>) result.get("resources");

        List<String> urls = new ArrayList<>();
        if (resources != null) {
            for (Map<String, Object> resource : resources) {
                String publicId = (String) resource.get("public_id");
                String url = cloudinary.url()
                        .secure(true)
                        .transformation(new Transformation<>()
                                .width(800)
                                .quality("auto")
                                .crop("scale")
                        )
                        .generate(publicId);
                urls.add(url);
            }
        }

        return urls;
    }

    public List<GalleryImageResponse> fetchGalleryImagesForAdmin(String treatmentName) throws Exception {
        String expression;
        if (treatmentName == null || treatmentName.isBlank()) {
            expression = String.format("folder:%s/*", ROOT_FOLDER);
        } else {
            String folderSlug = toFolderSlug(treatmentName);
            String folderPath = ROOT_FOLDER + "/" + folderSlug + "/";
            expression = String.format("folder:%s", folderPath);
        }

        Search search = cloudinary.search()
                .expression(expression)
                .maxResults(100)
                .sortBy("created_at", "desc");

        @SuppressWarnings("unchecked")
        Map<String, Object> result = (Map<String, Object>) search.execute();
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> resources =
                (List<Map<String, Object>>) result.get("resources");

        List<GalleryImageResponse> images = new ArrayList<>();
        if (resources != null) {
            for (Map<String, Object> resource : resources) {
                String publicId = (String) resource.get("public_id");
                String url = cloudinary.url()
                        .secure(true)
                        .transformation(new Transformation<>()
                                .width(800)
                                .quality("auto")
                                .crop("scale")
                        )
                        .generate(publicId);
                String treatmentNameFromId = extractTreatmentNameFromPublicId(publicId);
                images.add(new GalleryImageResponse(publicId, url, treatmentNameFromId));
            }
        }

        return images;
    }

    public void deleteImageByPublicId(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }

    private String toFolderSlug(String rawName) {
        if (rawName == null) {
            return "uncategorized";
        }
        String slug = rawName.trim().toLowerCase();
        slug = slug.replaceAll("[^a-z0-9\\s-]", "");
        slug = slug.replaceAll("\\s+", "-");
        slug = slug.replaceAll("-+", "-");
        if (slug.isEmpty()) {
            slug = "uncategorized";
        }
        return slug;
    }

    private String extractTreatmentNameFromPublicId(String publicId) {
        if (publicId == null) {
            return "Uncategorized";
        }
        // Example publicId: tender-clinic/teeth-whitening/abc123
        String prefix = ROOT_FOLDER + "/";
        int prefixIndex = publicId.indexOf(prefix);
        if (prefixIndex == -1) {
            return "Uncategorized";
        }
        int start = prefixIndex + prefix.length();
        int nextSlash = publicId.indexOf('/', start);
        String slug = nextSlash == -1
                ? publicId.substring(start)
                : publicId.substring(start, nextSlash);
        if (slug.isBlank()) {
            return "Uncategorized";
        }
        String withSpaces = slug.replace('-', ' ');
        String[] parts = withSpaces.split("\\s+");
        StringBuilder builder = new StringBuilder();
        for (String part : parts) {
            if (part.isEmpty()) continue;
            builder.append(Character.toUpperCase(part.charAt(0)));
            if (part.length() > 1) {
                builder.append(part.substring(1));
            }
            builder.append(' ');
        }
        return builder.toString().trim();
    }
}

