package senac.api.via.cep.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import senac.api.via.cep.dtos.EnderecoDTO;
import senac.api.via.cep.entities.Endereco;
import senac.api.via.cep.repositories.EnderecoRepository;

@RestController
@RequestMapping("/enderecos")
public class EnderecoController {

    @Autowired
    private EnderecoRepository enderecoRepository;

    
    public String removerCaracteresNaoNumericos(String cep) {
        return cep.replaceAll("\\D", "");
    }
    
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

   
    @PostMapping("/cadastro")
    public Endereco cadastrarEndereco(@RequestBody Endereco endereco) {
        return enderecoRepository.save(endereco);
    }
}
