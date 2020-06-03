import React, {Component, Fragment} from 'react'
import Header from '../../Components/Header/Header'

class About extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {

    }

    render() {
        return (
            <Fragment>
                <Header/>
                <div className='container'>
                    <h1>Sobre o projeto</h1>
                    <h3>Lucas Volfe</h3>
                    <p>Este projeto foi desenvolvido para expressar através de gráficos alguns parametros de leituras sensor de termperatura.</p>
                    <p>O FrontEnd foi feito com React utilizando de algumas bibliotecas para auxiliar o processo. E o backend foi feito com PHP e Lumen.</p>
                    <p>Os dados utilizados foram coletados de um arquivo disponibilizado com leituras de 2 dias. É feito uma tentativa de consumir o web service, caso esteja fora, ele le os dados internos do sensor.json para renderizar a tela.</p>
                    <p>Para calcular o tempo fora da faixa foi considerado o horário da leitura atual até a próxima leitura.</p>
                    <p>O filtro de data avalia se a data da leitura está dentro das datas selecionadas.</p>
                </div>
            </Fragment>
        )
    }
}

export default About
