package bitc.fullstack.meausrepro_spring.controller;

import bitc.fullstack.meausrepro_spring.model.MeausreProProject;
import bitc.fullstack.meausrepro_spring.service.ProjectService;
import bitc.fullstack.meausrepro_spring.service.QRCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/MeausrePro/Maps")
public class MeausreProController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private QRCodeService qrCodeService;

    // 저장
    @PostMapping("/save")
    public ResponseEntity<String> saveGeometry(@RequestBody MeausreProProject project) {
        if (project.getGeometry() == null || project.getGeometry().isEmpty()) {
            return ResponseEntity.badRequest().body("유효하지 않은 데이터");
        }

        System.out.println("받은 지오메트리 : " + project.getGeometry());

        projectService.save(project);

        return ResponseEntity.ok("프로젝트 데이터 저장 성공");
    }

    // QR 코드 생성 API
    @GetMapping("/generateQRCode")
    public ResponseEntity<byte[]> generateQRCode(@RequestParam String data) {
        try {
            byte[] qrCode = qrCodeService.generateQRCode(data);
            return ResponseEntity.ok()
                    .header("Content-Type", "image/png")
                    .body(qrCode);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @RequestMapping({"", "/"})
    public String index() throws Exception {
        return "Spring server 접속";
    }
}
