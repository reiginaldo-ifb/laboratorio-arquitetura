export class Calculadora {
    paraDecimal(valor, baseOrigem) {
        return parseInt(valor, baseOrigem);
    }

    converter(valorDecimal, baseDestino) {
        let n = valorDecimal;
        let passos = [];
        let resultado = "";
        const digitos = "0123456789ABCDEF";

        if (n === 0) return { resultado: "0", passos: [] };

        while (n > 0) {
            let resto = n % baseDestino;
            let quociente = Math.floor(n / baseDestino);
            let charResto = digitos[resto];
            passos.push({ dividendo: n, divisor: baseDestino, quociente, resto: charResto });
            resultado = charResto + resultado;
            n = quociente;
        }
        return { resultado, passos };
    }
}