package bitc.fullstack.meausrepro_spring.repository;

import bitc.fullstack.meausrepro_spring.model.MeausreProUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<MeausreProUser, String> {
}
