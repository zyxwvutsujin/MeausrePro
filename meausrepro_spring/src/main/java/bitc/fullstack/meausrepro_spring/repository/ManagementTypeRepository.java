package bitc.fullstack.meausrepro_spring.repository;

import bitc.fullstack.meausrepro_spring.model.MeausreManType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ManagementTypeRepository extends JpaRepository<MeausreManType, String> {
}
