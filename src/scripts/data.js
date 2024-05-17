import { read, utils } from 'xlsx';

export class Data {

    items = [];
    timeLabels = [];
    sortOrderByTime = [];

    constructor(arrayBuffer) {

        let workbook = read(
            arrayBuffer,
            { type: 'binary' },
            { dateNF: 'mm/dd/yyyy' }
        );
        let sheet = workbook.Sheets[workbook.SheetNames[0]];
        var rawData = utils.sheet_to_json(sheet, { header: 1 });

        this.timeLabels = rawData.map((row) => row[0]).slice(1);
        this.items = rawData[0].slice(1).map((name, index) => {
            return {
                name: name,
                data: rawData.slice(1).map((row) => row[index + 1]),
            };
        });

        for (let time = 0; time < this.timeLabels.length; time++) {
            let dataForTime = this.items
                .map((item, _) => ({ value: item.data[time], name: item.name }))
                .sort((a, b) => b.value - a.value)
                .map((item, _) => item.name);
    
            this.sortOrderByTime.push(dataForTime);
        }

    }

    getMaxValue(time) {
        return this.items.map(item => item.data[time]).reduce((a, b) => Math.max(a, b));
    }

    getItemOrder(name, time) {
        return this.sortOrderByTime[time].indexOf(name);
    }
}