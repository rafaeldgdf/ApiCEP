package senac.api.via.cep.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import senac.api.via.cep.entities.Usuario;

@NoArgsConstructor
@AllArgsConstructor
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