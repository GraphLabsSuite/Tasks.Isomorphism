import {IGraph, IVertex, IEdge, Graph, Vertex, Edge} from "graphlabs.core.graphs";
import {number} from "prop-types";
export class Isomorphism {

    public static checkNC(gr1: Graph<Vertex, Edge> ,gr2: Graph<Vertex, Edge>) {
        if (gr1.vertices.length !== gr2.vertices.length) { return false; }

        const dgVertices1 = this.getDGVertices(gr1).sort((a: number,b: number) =>{return a - b ;});
        const dgVertices2 = this.getDGVertices(gr2).sort((a: number,b: number)=>{return a - b ;});
        alert("OLD NC "+ (JSON.stringify(dgVertices1) === JSON.stringify(dgVertices2)));
        if (JSON.stringify(dgVertices1) !== JSON.stringify(dgVertices2)) { return false; }
        const adjMatrx1 = this.getAdjMatrix(gr1);
        const adjMatrx2 = this.getAdjMatrix(gr2);

        const detMatrix1 = getDetMatrix(adjMatrx1);
        const detMatrix2 = getDetMatrix(adjMatrx1);
        alert("DET " + (detMatrix1 === detMatrix2));
        if (detMatrix1 !== detMatrix2) { return false;}

        const wienerIndex1 = getWienerIndex(adjMatrx1);
        const wienerIndex2 = getWienerIndex(adjMatrx2);
        alert("WIENER "+ (wienerIndex1 === wienerIndex2));
        if (wienerIndex1 !== wienerIndex2) {return false;}
        return true;
    }

    public static getAdjMatrix(gr : Graph<Vertex, Edge>){
        let mtrx : any[] =[];
        for (let i = 0; i < gr.vertices.length; i++) {
            mtrx[i] = [];
            for (let j = 0; j < gr.vertices.length ; j++) {
                mtrx[i][j] = 0;
            }
        }

        gr.edges.forEach((item : IEdge, i: number, arr: any[]) => {
            const pos1 = Number(item.vertexOne.name.slice(1)) - 1;
            const pos2 = Number(item.vertexTwo.name.slice(1)) - 1;
            mtrx[pos1][pos2] = 1;
            mtrx[pos2][pos1] = 1;
         });

        return mtrx;
    }

    public static getDGVertices(gr: Graph<Vertex, Edge>){
         const dgVertices = new Array(gr.vertices.length).fill(0);
         gr.vertices.forEach((item1, i, arr1) =>{
              gr.edges.forEach((item2, j, arr2)=> {if (item2.vertexOne.name === item1.name || item2.vertexTwo.name === item1.name) { dgVertices[i]++; }
        });
    });
    return dgVertices;
    }


    public static checkIntersection(gr1: Graph<Vertex, Edge>, gr2: Graph<Vertex, Edge>, arrInters: any[]){
         let count = 0;
         gr1.edges.forEach((item1,i,arr1)=>{
            const v11 = item1.vertexOne.name;
            const v12 =item1.vertexTwo.name;
            const v21 = arrInters[arrInters.indexOf(v11) + 1];
            const v22 = arrInters[arrInters.indexOf(v12) + 1];
            gr2.edges.forEach((item2,j,arr2) =>{
                 if (item2.vertexOne.name === v21 && item2.vertexTwo.name === v22 || item2.vertexOne.name === v22 && item2.vertexTwo.name === v21) {
                     count++;
                 }
            });
         });
         if (count === gr1.edges.length) { return true }
         else { return false; }
    }


    public static checkIsomorphism(gr1: Graph<Vertex, Edge>,gr2: Graph<Vertex, Edge>) {
        const dgVertices1 = this.getDGVertices(gr1);
        const dgVertices2 = this.getDGVertices(gr2);
        let sorted = dgVertices1.slice().sort((a, b) => {
          return a - b;
         });

        let countClass = 1; // кол-во класссов эквивалентности
        let countVariation = 1; // кол-во вариантов перестановок

        let nn = 1;
        let n = 1;
        sorted.forEach( (item, i, arr) => {
            if (i !== arr.length - 1) {
                if (arr[i] === arr[i + 1]) {
                    n++;
                    nn = n;
                }
                else {
                    countVariation *= factorial(n);
                    countClass++;
                    nn = n;
                    n = 1;
                }
            }
        });
        countVariation *= factorial(nn);

        sorted = getUniq(sorted);
        const variations: any = [];

        const unionClasses: any = [];

        dgVertices1.forEach( (item, i, arr) => { // имя графа + имя вершиныы + _число смежных вершин
            dgVertices1[i] = "a" + (i + 1) + "_" + item;
        });
        dgVertices2.forEach( (item, i, arr) => { // имя графа + имя вершиныы + _число смежных вершин
            dgVertices2[i] = "b" + (i + 1) + "_" + item;
        });

        let class1: any[] = [];
        for (let i = 0; i < countClass; i++) {
            class1.push(returnClassArray(dgVertices1, sorted, i));
        }

        let class2: any[] = [];
        for (let i = 0; i < countClass; i++) {
            class2.push(returnClassArray(dgVertices2, sorted, i));
        }

        class1.forEach((item: any, j: number, arr: any[]) => {
            const perm = permutation(item);
            unionClasses.push(unionPermutation(perm, class2[j]));
        });


        for (let i = 0; i < countClass; i++) {
            let j = 0;

            for (let v = 0; v < countVariation; v++) {
                if(i === 0) {
                    variations[v] = unionClasses[i][j];
                    j++;
                }
                else {
                    variations[v] = variations[v].concat(unionClasses[i][j]);
                    j++;
                }
                if(j === unionClasses[i].length ) {j = 0;}
            }
        }


        let result = false;

        for (let v = 0; v < countVariation; v++) {
            if (Isomorphism.checkIntersection(gr1, gr2, variations[v]) === true) {
                result = true;
                break;
            }
        }
        return result;
}
}

function permutation(array: any[]) {
    let ret = [];

    for (let i = 0; i < array.length; i = i + 1) {
        let rest: any[] = permutation(array.slice(0, i).concat(array.slice(i + 1)));

        if(!rest.length) {
            ret.push([array[i]])
        } else {
            for (let j = 0; j < rest.length; j = j + 1) {
                ret.push([array[i]].concat(rest[j]))
            }
        }
    }
    return ret;
}

function getUniq(array: any[]) {
    var results : any[] = [];
    array.forEach((value) => {
        if (results.indexOf(value) == -1) {
            results.push(value);
        }
    });
    return results;
}

function returnClassArray(array: any[],sort: any[], id: number ){
    var res: any[] = [];
    var adj = sort[id];
    array.forEach( item => {
        if (adj == item.split('_')[1]) { res.push(item.split('_')[0]); }// только имя вершины, без степени
    })
    return res;
}

function unionPermutation(perm: any[], class2: any[]){

    let flag = perm.length*class2.length;
    perm.forEach((item, i, arr) => {
        let count = 1;
        for(let j = 0; j< class2.length; j++){
            perm[i].splice(count, 0, class2[j]);
            count = count +2;
        }
    })
    return perm;
}

function  factorial(n: number){
    let res = 1;
    while(n){
        res *= n--;
    }
    return res;
}

function getDetMatrix(array: any[]) {
    let det = 1;
    for (let k = 0; k < array.length; k++) {
        let max = Math.abs(array[k][k]);
        let r = k;
        for (let i = k + 1; i < array.length; i++) {
            if (Math.abs(array[i][k]) < max) {
                max = Math.abs(array[i][k]);
                r = i;
            }
        }
        if (max === 0) {
            return 0
        }
        ;
        if (r !== k) {
            det = -det;
            for (let j = 0; j < array.length; j++) {
                let c = array[k][j];
                array[k][j] = array[r][j];
                array[r][j] = c;
            }
        }
        for (let i = k + 1; i < array.length; i++) {
            for (let m = array[i][k] / array[k][k], j = k; j < array.length; j++) {
                array[i][j] -= m * array[k][j];
            }
        }
    }

    for ( let i = 0; i < array.length; i++) {
        det *= array[i][i];
    }

    return det;
}

function getWienerIndex(array : any[]){
    let res = 0;
    let d : any[] =[];
    for (let i = 0; i < array.length; i++) {
        d[i] = [];
        for (let j = 0; j < array.length ; j++) {
            d[i][j] = 0;
        }
    }
    for (let i = 0; i < array.length; i++){
        for (let j = 0; j < array.length; j++){
            if (array[i][j] === 1 || i === j) {d[i][j] = array[i][j];}
            else {d[i][j] = array.length;}
        }
    }

    for (let m = 0; m < array.length; m++){
        for (let i = 0; i < array.length; i++){
            for (let j = 0; j < array.length ; j++){
                d[i][j] = Math.min(d[i][j], d[i][m] + d[m][j]);
            }
        }
    }

    for(let i = 0; i < array.length; i++){
        for (let j = 0; j < array.length; j++){
            res = res + d[i][j];
        }
    }
    res = res/2;
    return res;
}

