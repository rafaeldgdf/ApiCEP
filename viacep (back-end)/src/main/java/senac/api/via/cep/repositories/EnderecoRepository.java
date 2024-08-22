package senac.api.via.cep.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import senac.api.via.cep.entities.Endereco;

public interface EnderecoRepository extends JpaRepository<Endereco, Long> {
}
