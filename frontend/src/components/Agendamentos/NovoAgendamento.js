import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NovoAgendamento.css';
import TabelaAgendamento from './TabelaAgendamento';

function NovoAgendamento() {
  const agendamentoInicial = {
    cliente: {},
    barbeiro: {},
    servicos: [],
    data: '',
    hora: '',
    observacao: '',
  };
  const [agendamentos, setAgendamentos] = useState([]);
  const [agendamentoAtual, setAgendamentoAtual] = useState(agendamentoInicial);
  const [clientes, setClientes] = useState([]);
  const [cliente, setCliente] = useState(0);
  const [barbeiros, setBarbeiros] = useState([]);
  const [barbeiro, setBarbeiro] = useState(0);
  const [servicos, setServicos] = useState([]);
  const [servicosSelecionados, setServicosSelecionados] = useState([]);
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [observacao, setObservacao] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/listarCliente')
      .then(response => {
        setClientes(response.data);
      })
      .catch(error => {
        console.error(error);
      });

    axios.get('http://localhost:8080/listarBarbeiro')
      .then(response => {
        setBarbeiros(response.data);
      })
      .catch(error => {
        console.error(error);
      });

    axios.get('http://localhost:8080/listarServicos')
      .then(response => {
        setServicos(response.data);
      })
      .catch(error => {
        console.error(error);
      });

    fetch('http://localhost:8080/listarAgendamentos')
      .then((retorno) => retorno.json())
      .then((retorno_convertido) => {
        setAgendamentos(retorno_convertido);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    console.log(cliente)
  }, [cliente])

  const handleServicoSelection = (e) => {
    const servicoId = Number(e.target.value);

    if (e.target.checked) {
      // Se a caixa de seleção estiver marcada, adiciona o serviço aos selecionados
      setServicosSelecionados([...servicosSelecionados, { id: servicoId }]);
    } else {
      // Se a caixa de seleção estiver desmarcada, remove o serviço dos selecionados
      setServicosSelecionados(servicosSelecionados.filter((s) => s.id !== servicoId));
    }
  };

  const [btnCadastrarAgendamento, setBtnCadastrarAgendamento] = useState(true);

  const limparFormulario = () => {
    setCliente('');
    setBarbeiro('');
    setServicosSelecionados([]);
    setData('');
    setHora('');
    setObservacao('');
    setBtnCadastrarAgendamento(true);
  };

  const selecionarAgendamento = (indice) => {
    setAgendamentoAtual(agendamentos[indice]);
    setBtnCadastrarAgendamento(false);
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!cliente || !barbeiro || servicosSelecionados.length === 0) {
      return; // Certifique-se de que os três itens foram selecionados
    }

    const newAgendamento = {
      cliente: { id: Number(cliente) },
      barbeiro: { id: Number(barbeiro) },
      servicos: servicosSelecionados,
      data,
      hora,
      observacao
    };

    console.log(newAgendamento, cliente, barbeiro);

    axios.post('http://localhost:8080/novoAgendamento', newAgendamento)
      .then(response => {
        console.log(response.data);
        fetch('http://localhost:8080/listarAgendamentos')
          .then((retorno) => retorno.json())
          .then((retorno_convertido) => {
            setAgendamentos(retorno_convertido);
            limparFormulario(); // Mova a chamada aqui para manter a seleção de serviços até que a lista de agendamentos seja atualizada.
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch(error => {
        console.error(error);
      });
  };
  return (
    <div>
      <h2>Novo Agendamento</h2>
      <form onSubmit={handleSubmit}>
        <div className="column">
          <h3>Selecionar Cliente</h3>
          <select
            placeholder="Cliente"
            value={cliente}
            onChange={e => setCliente(e.target.value)}
          >
            {clientes.map(cliente => (
              <option key={cliente.id} value={cliente.id} >
                {cliente.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="column">
          <h3>Selecionar Barbeiro</h3>
          <select
            placeholder="Barbeiro"
            value={barbeiro}
            onChange={e => setBarbeiro(e.target.value)}
          >
            {barbeiros.map(barbeiro => (
              <option key={barbeiro.id} value={barbeiro.id}>
                {barbeiro.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="column">
          <details>
            <summary>Selecionar Serviços</summary>
            {servicos.map((servico) => (
              <label key={servico.id} className="select-option">
                <input
                  type="checkbox"
                  value={servico.id}
                  checked={servicosSelecionados.some((s) => s.id === servico.id)}
                  onChange={handleServicoSelection}
                />
                {servico.nome}
              </label>
            ))}
          </details>
        </div>
        <div className="column">
          <h3>Data</h3>
          <input
            type="text"
            placeholder="Data"
            value={data}
            onChange={e => setData(e.target.value)}
          />
        </div>

        <div className="column">
          <h3>Hora</h3>
          <input
            type="text"
            placeholder="Hora"
            value={hora}
            onChange={e => setHora(e.target.value)}
          />
        </div>
        <div className="column">
          <h3>Observação</h3>
          <input
            type="text"
            placeholder="Observação"
            value={observacao}
            onChange={e => setObservacao(e.target.value)}
          />
        </div>
        <button type="submit" className='btn btn-primary'>Criar Agendamento</button>
      </form>
      <TabelaAgendamento vetor={agendamentos} selecionar={selecionarAgendamento} />
    </div>
  );
}

export default NovoAgendamento;