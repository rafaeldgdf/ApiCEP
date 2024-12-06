package senac.api.via.cep.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import senac.api.via.cep.dtos.CoordenadasDTO;
import senac.api.via.cep.dtos.EnderecoDTO;
import senac.api.via.cep.entities.Endereco;
import senac.api.via.cep.repositories.EnderecoRepository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/enderecos")
public class EnderecoController {

    @Autowired
    private EnderecoRepository enderecoRepository;

    // Função para remover caracteres não numéricos do CEP
    public String removerCaracteresNaoNumericos(String cep) {
        return cep.replaceAll("\\D", "");
    }

    // Consulta CEP na API do ViaCEP
    @GetMapping("/consulta-cep/{cep}")
    public ResponseEntity<Endereco> consultaCep(@PathVariable String cep) {
        String cepFormatado = removerCaracteresNaoNumericos(cep);
        if (cepFormatado.length() == 8) {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://viacep.com.br/ws/" + cepFormatado + "/json/";
            ResponseEntity<Endereco> response = restTemplate.getForEntity(url, Endereco.class);

            if (response.getBody() != null && response.getBody().getCep() != null) {
                return ResponseEntity.ok(response.getBody());
            } else {
                return ResponseEntity.badRequest().build();
            }
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    // Cadastro de Endereço
    @PostMapping("/cadastro")
    public Endereco cadastrarEndereco(@RequestBody Endereco endereco) {
        return enderecoRepository.save(endereco);
    }

    // GET all - Listar todos os endereços
    @GetMapping
    public List<Endereco> listarEnderecos() {
        return enderecoRepository.findAll();
    }

    // PUT - Atualizar endereço por ID
    @PutMapping("/{id}")
    public ResponseEntity<Endereco> atualizarEndereco(@PathVariable Long id, @RequestBody Endereco enderecoDetalhes) {
        Optional<Endereco> enderecoExistente = enderecoRepository.findById(id);

        if (enderecoExistente.isPresent()) {
            Endereco enderecoAtualizado = enderecoExistente.get();
            enderecoAtualizado.setCep(enderecoDetalhes.getCep());
            enderecoAtualizado.setLogradouro(enderecoDetalhes.getLogradouro());
            enderecoAtualizado.setNumero(enderecoDetalhes.getNumero());
            enderecoAtualizado.setComplemento(enderecoDetalhes.getComplemento());
            enderecoAtualizado.setBairro(enderecoDetalhes.getBairro());
            enderecoAtualizado.setLocalidade(enderecoDetalhes.getLocalidade());
            enderecoAtualizado.setUf(enderecoDetalhes.getUf());
            return ResponseEntity.ok(enderecoRepository.save(enderecoAtualizado));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE - Deletar endereço por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarEndereco(@PathVariable Long id) {
        if (enderecoRepository.existsById(id)) {
            enderecoRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    private Map<String, Object> safeCastToMap(Object obj) {
        if (obj instanceof Map) {
            return (Map<String, Object>) obj;
        }
        return null;
    }

    
    @PostMapping("/geolocalizacao")
    public ResponseEntity<EnderecoDTO> getEnderecoPorCoordenadas(@RequestBody CoordenadasDTO coordenadas) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            // URL da API para obter endereço com base nas coordenadas
            String url = String.format(
                "https://nominatim.openstreetmap.org/reverse?format=json&lat=%s&lon=%s",
                coordenadas.getLat(), coordenadas.getLng()
            );

            // Chamada à API com tipagem parametrizada
            ParameterizedTypeReference<Map<String, Object>> typeRef = new ParameterizedTypeReference<>() {};
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(url, org.springframework.http.HttpMethod.GET, null, typeRef);

            if (response.getBody() != null) {
                Map<String, Object> data = response.getBody();

                // Validar e realizar cast seguro do "address"
                if (data.containsKey("address") && data.get("address") instanceof Map) {
                	Map<String, Object> address = safeCastToMap(data.get("address"));

                    // Construir o DTO a partir dos dados
                    EnderecoDTO enderecoDTO = new EnderecoDTO();
                    enderecoDTO.setCep((String) address.getOrDefault("postcode", ""));
                    enderecoDTO.setLogradouro((String) address.getOrDefault("road", ""));
                    enderecoDTO.setBairro((String) address.getOrDefault("suburb", ""));
                    enderecoDTO.setLocalidade((String) address.getOrDefault("city", ""));
                    enderecoDTO.setUf((String) address.getOrDefault("state", ""));

                    return ResponseEntity.ok(enderecoDTO);
                } else {
                    // Quando o "address" não está presente ou é inválido
                    return ResponseEntity.badRequest().body(null);
                }
            } else {
                // Quando a resposta não contém corpo
                return ResponseEntity.badRequest().body(null);
            }
        } catch (Exception e) {
            // Registrar erro no servidor e retornar status 500
            e.printStackTrace();
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    

}
    
    


