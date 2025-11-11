// Controlador do lado cliente para cupons
class CuponsController {
    constructor() {
        this.cupons = [];
        this.init();
    }

    init() {
        this.carregarCupons();
        this.configurarEventos();
    }

    configurarEventos() {
        // Evento para validar cupom ao pressionar Enter
        const inputCodigo = document.getElementById('codigo-cupom');
        if (inputCodigo) {
            inputCodigo.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.validarCupom();
                }
            });
        }
    }

    async carregarCupons() {
        try {
            const response = await fetch('/api/cupons/todos');
            const data = await response.json();
            
            if (data.success) {
                this.cupons = data.cupons;
                this.renderizarCupons();
            } else {
                console.error('Erro ao carregar cupons:', data.erro);
                this.mostrarCuponsEstaticos();
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            this.mostrarCuponsEstaticos();
        }
    }

    renderizarCupons() {
        const lista = document.getElementById('cupons-lista');
        if (!lista) return;

        if (this.cupons.length === 0) {
            lista.innerHTML = '<p>Nenhum cupom disponível no momento.</p>';
            return;
        }

        lista.innerHTML = this.cupons.map(cupom => {
            const isValido = this.verificarValidadeCupom(cupom);
            const statusClass = isValido ? '' : 'cupom-invalido';
            const statusText = isValido ? '' : '(EXPIRADO)';
            
            return `
                <div class="cupom-card ${statusClass}">
                    <h4>${cupom.codigo} ${statusText}</h4>
                    <p>Tipo: ${cupom.tipo}</p>
                    <p>Valor: ${cupom.tipo === 'percentual' ? cupom.valor + '%' : 'R$ ' + cupom.valor}</p>
                    <p>Válido até: ${this.formatarData(cupom.data_fim)}</p>
                    <button onclick="cuponsController.copiarCodigo('${cupom.codigo}')" ${!isValido ? 'disabled' : ''}>
                        Copiar Código
                    </button>
                </div>
            `;
        }).join('');
    }

    mostrarCuponsEstaticos() {
        // Fallback para cupons estáticos caso a API falhe
        const cuponsEstaticos = [
            { codigo: 'DESCONTO10', tipo: 'fixo', valor: 10, data_fim: '2025-12-31', ativo: true },
            { codigo: 'FRETE20', tipo: 'fixo', valor: 20, data_fim: '2026-01-30', ativo: true },
            { codigo: 'PRIMEIRA15', tipo: 'percentual', valor: 15, data_fim: '2025-11-15', ativo: true },
            { codigo: 'GLEISON60', tipo: 'percentual', valor: 60, data_fim: '2025-11-30', ativo: true },
            { codigo: 'EXPIRADO50', tipo: 'percentual', valor: 50, data_fim: '2024-12-31', ativo: false }
        ];
        
        this.cupons = cuponsEstaticos;
        this.renderizarCupons();
    }

    async validarCupom() {
        const codigo = document.getElementById('codigo-cupom').value.trim();
        const resultadoDiv = document.getElementById('resultado-validacao');
        
        if (!codigo) {
            resultadoDiv.innerHTML = '<p style="color: orange;">⚠️ Digite um código de cupom</p>';
            return;
        }

        try {
            const response = await fetch('/api/cupons/validar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ codigo: codigo })
            });

            const data = await response.json();
            
            if (data.valido) {
                resultadoDiv.innerHTML = `
                    <div style="color: green;">
                        <p>✅ Cupom válido!</p>
                        <p>Desconto: ${data.cupom.tipo === 'percentual' ? data.cupom.valor + '%' : 'R$ ' + data.cupom.valor}</p>
                    </div>
                `;
            } else {
                resultadoDiv.innerHTML = `<p style="color: red;">❌ ${data.erro}</p>`;
            }
        } catch (error) {
            console.error('Erro ao validar cupom:', error);
            // Fallback para validação local
            this.validarCupomLocal(codigo, resultadoDiv);
        }
    }

    validarCupomLocal(codigo, resultadoDiv) {
        const cuponsValidos = ['DESCONTO10', 'FRETE20', 'PRIMEIRA15', 'GLEISON60'];
        
        if (cuponsValidos.includes(codigo.toUpperCase())) {
            resultadoDiv.innerHTML = '<p style="color: green;">✅ Cupom válido!</p>';
        } else {
            resultadoDiv.innerHTML = '<p style="color: red;">❌ Cupom inválido ou expirado</p>';
        }
    }

    copiarCodigo(codigo) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(codigo).then(() => {
                this.mostrarMensagem(`Código copiado: ${codigo}`, 'success');
            }).catch(() => {
                this.copiarCodigoFallback(codigo);
            });
        } else {
            this.copiarCodigoFallback(codigo);
        }
    }

    copiarCodigoFallback(codigo) {
        // Fallback para navegadores mais antigos
        const textArea = document.createElement('textarea');
        textArea.value = codigo;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        this.mostrarMensagem(`Código copiado: ${codigo}`, 'success');
    }

    mostrarMensagem(mensagem, tipo = 'info') {
        // Criar ou atualizar elemento de mensagem
        let msgElement = document.getElementById('mensagem-temporaria');
        if (!msgElement) {
            msgElement = document.createElement('div');
            msgElement.id = 'mensagem-temporaria';
            msgElement.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 10px 20px;
                border-radius: 5px;
                color: white;
                font-weight: bold;
                z-index: 1000;
                transition: opacity 0.3s;
            `;
            document.body.appendChild(msgElement);
        }

        // Definir cor baseada no tipo
        const cores = {
            success: '#4CAF50',
            error: '#f44336',
            info: '#2196F3',
            warning: '#ff9800'
        };

        msgElement.style.backgroundColor = cores[tipo] || cores.info;
        msgElement.textContent = mensagem;
        msgElement.style.opacity = '1';

        // Remover após 3 segundos
        setTimeout(() => {
            msgElement.style.opacity = '0';
            setTimeout(() => {
                if (msgElement.parentNode) {
                    msgElement.parentNode.removeChild(msgElement);
                }
            }, 300);
        }, 3000);
    }

    verificarValidadeCupom(cupom) {
        if (!cupom.ativo) return false;
        
        const hoje = new Date();
        const dataFim = new Date(cupom.data_fim);
        return dataFim >= hoje;
    }

    formatarData(dataString) {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
    }
}

// Inicializar controlador quando a página carregar
let cuponsController;
document.addEventListener('DOMContentLoaded', function() {
    cuponsController = new CuponsController();
});