package bitc.fullstack.meausrepro_spring.repository;

import bitc.fullstack.meausrepro_spring.model.MeausreProSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SectionRepository extends JpaRepository<MeausreProSection, String> {
    // 특정 프로젝트 구간 보기
    @Query("SELECT s FROM MeausreProSection s WHERE s.projectId.idx = :projectId ORDER BY s.idx ASC")
    List<MeausreProSection> findAllByProjectId(int projectId);
}
