class Predavanje {

    constructor(Predavanje_ID,naziv,tip,opis,brojPolaznika,slobodnaMjesta,ukupnoMjesta,mjestoOdrzavanja,vrijemePocetka){
        brojPolaznika++;
        slobodnaMjesta=ukupnoMjesta--;
        if(slobodnaMjesta<=0){
            alert('Nema slobodnih mjesta na ovom predavanju');
        }
        this.Predavanje_ID=Predavanje_ID;
        this.naziv = naziv;
        this.tip=tip;
        this.opis=opis;
        this.brojPolaznika=brojPolaznika;
        this.slobodnaMjesta=slobodnaMjesta;
        this.ukupnoMjesta=ukupnoMjesta;
        this.mjestoOdrzavanja=mjestoOdrzavanja;
        this.vrijemePocetka=vrijemePocetka
       
        
    }
}
//module.exports = Predavanje

export default Predavanje