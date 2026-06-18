export class ApiService {
    async buscarRacas() {
        try {
            const res = await fetch("https://dog.ceo/api/breeds/list/all");
            const data = await res.json();
            return Object.keys(data.message);
        } catch (e) { return []; }
    }
}