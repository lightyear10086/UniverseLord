class Job{
    constructor(npc,type){
        this.npc=npc;
        this.jobTime="day";
    }
    JobUpdate(){
        switch(this.jobTime){
            case "hour":
                this.npc.jobHour();
                break;
            case "day":
                this.npc.jobDay();
                break;
            case "month":
                this.npc.jobMonth();
                break;
            case "year":
                this.npc.jobYear();
                break;
        }
    }
    jobHour(){
    }
    jobDay(){
    }
    jobMonth(){
    }
    jobYear(){
    }
}