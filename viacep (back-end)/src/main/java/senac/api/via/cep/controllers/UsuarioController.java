package senac.api.via.cep.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import senac.api.via.cep.dtos.EnderecoDTO;
import senac.api.via.cep.dtos.UsuarioComEnderecosDTO;
import senac.api.via.cep.entities.Endereco;
import senac.api.via.cep.entities.Usuario;
import senac.api.via.cep.repositories.UsuarioRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // CREATE
    @PostMapping
    public ResponseEntity<Usuario> criarUsuario(@RequestBody UsuarioComEnderecosDTO usuarioComEnderecosDTO) {
        Usuario usuario = new Usuario();
        usuario.setNome(usuarioComEnderecosDTO.getNome());

        List<Endereco> enderecos = usuarioComEnderecosDTO.getEnderecos().stream().map(dto -> {
            Endereco endereco = new Endereco();
            endereco.setCep(dto.getCep());
            endereco.setLogradouro(dto.getLogradouro());
            endereco.setComplemento(dto.getComplemento());
            endereco.setNumero(dto.getNumero());
            endereco.setBairro(dto.getBairro());
            endereco.setLocalidade(dto.getLocalidade());
            endereco.setUf(dto.getUf());
            endereco.setUsuario(usuario); // Associa o endereço ao usuário
            return endereco;
        }).collect(Collectors.toList());

        usuario.setEnderecos(enderecos);
        Usuario novoUsuario = usuarioRepository.save(usuario);
        return ResponseEntity.ok(novoUsuario);
    }

    // READ
    @GetMapping
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obterUsuarioPorId(@PathVariable Long id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        return usuario.map(ResponseEntity::ok)
                      .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuarioDetalhes) {
        Optional<Usuario> usuarioExistente = usuarioRepository.findById(id);

        if (usuarioExistente.isPresent()) {
            Usuario usuarioAtualizado = usuarioExistente.get();
            usuarioAtualizado.setNome(usuarioDetalhes.getNome());
            usuarioAtualizado.setEnderecos(usuarioDetalhes.getEnderecos());
            return ResponseEntity.ok(usuarioRepository.save(usuarioAtualizado));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarUsuario(@PathVariable Long id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
