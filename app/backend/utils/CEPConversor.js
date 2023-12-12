const states = [
    { start: 100, name: 'São Paulo', code: 'SP' },
    { start: 200, name: 'Rio de Janeiro', code: 'RJ' },
    { start: 290, name: 'Espírito Santo', code: 'ES' },
    { start: 300, name: 'Minas Gerais', code: 'MG' },
    { start: 400, name: 'Bahia', code: 'BA' },
    { start: 490, name: 'Sergipe', code: 'SE' },
    { start: 500, name: 'Pernambuco', code: 'PE' },
    { start: 570, name: 'Alagoas', code: 'AL' },
    { start: 580, name: 'Paraíba', code: 'PB' },
    { start: 590, name: 'Rio Grande do Norte', code: 'RN' },
    { start: 600, name: 'Ceará', code: 'CE' },
    { start: 640, name: 'Piauí', code: 'PI' },
    { start: 650, name: 'Maranhão', code: 'MA' },
    { start: 660, name: 'Pará', code: 'PA' },
    { start: 689, name: 'Amapá', code: 'AP' },
    { start: 690, name: 'Amazonas', code: 'AM' },
    { start: 693, name: 'Roraima', code: 'RR' },
    { start: 699, name: 'Acre', code: 'AC' },
    { start: 700, name: 'Distrito Federal', code: 'DF' },
    { start: 728, name: 'Goiás', code: 'GO' },
    { start: 770, name: 'Tocantins', code: 'TO' },
    { start: 780, name: 'Mato Grosso', code: 'MT' },
    { start: 789, name: 'Rondônia', code: 'RO' },
    { start: 790, name: 'Mato Grosso do Sul', code: 'MS' },
    { start: 800, name: 'Paraná', code: 'PR' },
    { start: 880, name: 'Santa Catarina', code: 'SC' },
    { start: 900, name: 'Rio Grande do Sul', code: 'RS' }
];

class CEPConversor {

    static validateCEP(cep) {
        const cepFormatted = cep.replace(/[^0-9]/g, '');

        if (cepFormatted.match(/^[0-9]{8}$/))
            return cepFormatted;

        return null;
    }

    static getStateByCEP(cep) {

        const cepFormatted = this.validateCEP(cep);

        if (cepFormatted) {
            const fmt = parseInt(cepFormatted.substr(0, 3));

            for (let i = 0; i < states.length; i++) {
                if (i < states.length - 1) {
                    if (states[i].start <= fmt && states[i + 1].start > fmt)
                        return states[i].code;
                    else continue;
                } else {
                    return states[i].code;
                }
            }
        }
        return cepFormatted;
    }
};

module.exports = CEPConversor;
