import {Graph} from "graphlabs.core.graphs"
import {Vertex} from "graphlabs.core.graphs"
import {Edge} from "graphlabs.core.graphs"

import {store} from 'graphlabs.core.template';

export class GraphLoader {

    public static parseFromStr(){

        const graphStore1 = new Graph();    
        const graphStore2 = new Graph();

        const data = sessionStorage.getItem('variant');
        let objectData;

        objectData = JSON.parse(data||"null");

        if (objectData){
            if (objectData.data[0].type === 'n-graphs'){
                const obj11=JSON.parse(objectData.data[0].value.graphs);
            }
        }


        const graphStore = store.getState().graph;

        //получение графа почему-то не работает - пока пилим сами. 
        const graph = new Graph();
        graph.addVertex(new Vertex ("1"));
        graph.addVertex(new Vertex ("2"));
        graph.addVertex(new Vertex ("3"));
        graph.addVertex(new Vertex ("4"));
        graph.addVertex(new Vertex ("5"));
        graph.addVertex(new Vertex ((data||"null").toString()));

        graph.addEdge(new Edge (graph.vertices[0], graph.vertices[1]));
        graph.addEdge(new Edge (graph.vertices[1], graph.vertices[2]));
        graph.addEdge(new Edge (graph.vertices[2], graph.vertices[3]));
        graph.addEdge(new Edge (graph.vertices[3], graph.vertices[4]));
        graph.addEdge(new Edge (graph.vertices[4], graph.vertices[0]));

        var str = '{"id": [ { "vertex": [';
        graph.vertices.forEach((v: Vertex) => { str += '"a' + v.name + '",'; }); 
        str = str.substring(0, str.length - 1);

        str += '], "edge": [';
        graph.edges.forEach((e: Edge) => { str += '"a' + e.vertexOne.name + '","a' + e.vertexTwo.name + '",' });
        str = str.substring(0, str.length - 1);

        //нужно добавить получение нового графа

        str += '] }, {"vertex":[';
        graph.vertices.forEach((v: Vertex) => { str += '"b' + v.name + '",'; }); 
        str = str.substring(0, str.length - 1);

        str += '], "edge": [';
        graph.edges.forEach((e: Edge) => { str += '"b' + e.vertexOne.name + '","b' + e.vertexTwo.name + '",' });
        str = str.substring(0, str.length - 1);

        str += ']} ]}';

        // const str = '{"id": [ { "vertex": ["a1","a2","a3","a4","a5"], "edge": ["a1","a4","a4","a3","a2","a5","a4","a2"] }, {"vertex":["b1", "b2","b3","b4","b5"], "edge": ["b1","b2","b2","b3","b4","b5","b2","b4"]} ]}';
        const str0 = '{"id": [ { "vertex": [], "edge": [] }, {"vertex":[], "edge": []} ]}'; // шаблон
        const str1 = str;
        //const str1 = '{"id": [ { "vertex": ["a1","a2","a3","a4","a5"], "edge": ["a1","a2","a2","a3","a3","a4","a4","a5","a5","a1"] }, {"vertex":["b1","b2","b3","b4","b5"], "edge": ["b1","b4","b4","b2","b2","b5","b5","b3","b3","b1"]} ]}'; // шаблон
        const str2 = '{"id": [ { "vertex": ["a1","a2","a3","a4","a5"], "edge": ["a1","a2","a1","a3","a2","a3","a2","a4","a3","a5","a4","a5"] }, {"vertex":["b1","b2","b3","b4","b5"], "edge": ["b1","b2","b1","b3","b2","b5","b2","b4","b4","b5","b3","b4"]} ]}';
        const str3 = '{"id": [ { "vertex": ["a1","a2","a3","a4","a5","a6"], "edge": ["a1","a2","a1","a3","a1","a4","a2","a3","a2","a4","a2","a6","a6","a4","a3","a5","a5","a4","a3","a4"] }, {"vertex":["b1","b2","b3","b4","b5","b6"], "edge": ["b1","b2","b1","b3","b1","b6","b2","b3","b3","b4","b6","b4","b3","b5","b6","b5"]} ]}';
        const str4 = '{"id": [ { "vertex": ["a1","a2","a3","a4","a5","a6"], "edge": ["a1","a2","a1","a4","a1","a6","a2","a3","a2","a6","a3","a6","a3","a5","a3","a4","a4","a5","a5","a6"] }, {"vertex":["b1","b2","b3","b4","b5","b6"], "edge": ["b1","b2","b1","b4","b1","b5","b2","b6","b2","b3","b5","b6","b5","b4","b5","b3","b6","b3","b4","b3"]} ]}';
        const str5 = '{"id": [ { "vertex": ["a1","a2","a3","a4","a5","a6"], "edge": ["a1","a2","a1","a3","a1","a6","a2","a4","a2","a5","a3","a4","a3","a6","a4","a5","a6","a5"] }, {"vertex":["b1","b2","b3","b4","b5","b6"], "edge": ["b1","b2","b1","b3","b1","b5","b2","b3","b2","b6","b3","b4","b4","b5","b4","b6","b5","b6"]} ]}';
        const str6 = '{"id": [ { "vertex": ["a1","a2","a3","a4","a5","a6","a7"], "edge": ["a1","a2","a1","a3","a1","a4","a2","a4","a3","a4","a5","a6","a2","a5","a3","a6","a5","a7","a7","a2"] }, {"vertex":["b1","b2","b3","b4","b5","b6","b7"], "edge": ["b1","b2","b1","b4","b1","b5","b6","b3","b4","b3","b4","b5","b5","b6","b6","b2","b3","b7","b7","b3"]} ]}';
        const obj=JSON.parse(str1);
        return obj;
    }

    public static createGraph(obj : any, id : number){

        const graph = new Graph();

        obj.id[id].vertex.forEach((item : any, i: any,arr : any[] ) =>{
            graph.addVertex(new Vertex(obj.id[id].vertex[i]));
        });

        obj.id[id].edge.forEach((item : any,i: any, arr: any[]) =>{
            if (i % 2 === 0) { graph.addEdge(new Edge(graph.getVertex(obj.id[id].edge[i])[0],graph.getVertex(obj.id[id].edge[i+1])[0])); }
        });

        return graph;
    };

}
