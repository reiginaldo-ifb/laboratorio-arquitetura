export class Logica {
    gerarCombinacoes(numVars) {
        const total = Math.pow(2, numVars);
        let combinacoes = [];
        for (let i = 0; i < total; i++) {
            let obj = {};
            for (let j = 0; j < numVars; j++) {
                obj[String.fromCharCode(65 + j)] = (i >> (numVars - 1 - j)) & 1;
            }
            combinacoes.push(obj);
        }
        return combinacoes;
    }

    resolverExpressao(exp, valores) {
        let jsExp = exp.replace(/\./g, '&&').replace(/\+/g, '||');
        // Trata a negação externa (ex: A')
        jsExp = jsExp.replace(/([A-D0-1'])\'/g, '!$1').replace(/\)\'/g, ') === 0 ? 1 : 0');
        
        for (let v in valores) {
            jsExp = jsExp.replace(new RegExp(v, 'g'), valores[v]);
        }
        try { return eval(jsExp) ? 1 : 0; } catch (e) { return "Err"; }
    }
}