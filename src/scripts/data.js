import { read, utils } from 'xlsx';

export class Data {

    items = [];

    constructor(arrayBuffer) {
        let workbook = read(
            arrayBuffer,
            { type: 'binary' },
            { dateNF: 'mm/dd/yyyy' }
        );
    }
}

export let timeLabels = [
    "2010 Q1", "2010 Q2", "2010 Q3", "2010 Q4", "2011 Q1", "2011 Q2", "2011 Q3", "2011 Q4", "2012 Q1", "2012 Q2"
];

export let items = [
    { 
        name: "C#", 
        data: [100, 110, 120, 130, 140, 150, 160, 170, 1080, 190]
    },
    {
        name: "Java",
        data: [201, 210, 220, 230, 240, 250, 260, 270, 180, 290]
    },
    {
        name: "Python",
        data: [302, 310, 320, 330, 340, 350, 1360, 370, 380, 390]
    },
    { 
        name: "Javascript", 
        data: [105, 110, 120, 130, 140, 150, 160, 170, 580, 190]
    },
    {
        name: "Go",
        data: [120, 210, 220, 230, 240, 250, 260, 270, 280, 290]
    },
    {
        name: "Swift",
        data: [301, 310, 320, 330, 340, 350, 360, 370, 380, 390]
    },
    { 
        name: "Kotlin", 
        data: [110, 110, 120, 130, 140, 150, 160, 170, 180, 190]
    },
    {
        name: "PHP",
        data: [200, 210, 220, 230, 240, 250, 260, 270, 280, 290]
    },
    {
        name: "VB",
        data: [320, 310, 320, 330, 340, 350, 360, 0, 380, 390]
    },
    { 
        name: "Pascal", 
        data: [1, 110, 120, 130, 140, 150, 160, 170, 180, 190]
    }
];

let sortOrderByTime = [];

function init() {
    for (let time = 0; time < timeLabels.length; time++) {
        let dataForTime = items
            .map((item, _) => ({ value: item.data[time], name: item.name }))
            .sort((a, b) => b.value - a.value)
            .map((item, _) => item.name);

        sortOrderByTime.push(dataForTime);
    }
}

init();

export function getItemOrder(name, time) {
    return sortOrderByTime[time].indexOf(name);
}

export function getMaxValue(time) {
    return items.map(item => item.data[time]).reduce((a, b) => Math.max(a, b));
}

export function setupWithNewData(newTimeLabels, newItems) {
    timeLabels = newTimeLabels;
    items = newItems;
    sortOrderByTime = [];
    init();
}