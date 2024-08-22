package senac.api.via.cep.repositories;


import org.springframework.data.jpa.repository.JpaRepository;

import senac.api.via.cep.entities.Usuario;


public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
}
