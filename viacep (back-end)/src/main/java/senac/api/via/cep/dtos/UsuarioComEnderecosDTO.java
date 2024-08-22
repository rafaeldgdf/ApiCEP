package senac.api.via.cep.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioComEnderecosDTO {

    private String nome;
    private List<EnderecoDTO> enderecos;
}
