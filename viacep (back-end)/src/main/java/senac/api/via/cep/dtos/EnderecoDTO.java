package senac.api.via.cep.dtos;

import lombok.Builder;
import lombok.Data;
import senac.api.via.cep.entities.Usuario;

@Data
@Builder
public class EnderecoDTO {
    private String cep;
    private String logradouro;
    private String complemento;
    private String numero;
    private String bairro;
    private String localidade;
    private String uf;
}