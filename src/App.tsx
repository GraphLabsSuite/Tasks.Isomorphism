import * as React from 'react';
import {store, graphModel, GraphVisualizer, Template, Toolbar, ToolButtonList} from 'graphlabs.core.template';
//import { Adapter } from "./Adapter";
import { Console } from "graphlabs.core.template";
import { StudentMark } from "graphlabs.core.template";
//import {default as styled, StyledFunction } from 'styled-components';
import {Component, HTMLProps, SFC} from 'react';
//import {GraphLoader} from "./GraphLoader";
import {graphActionCreators} from "graphlabs.core.template";
import {Isomorphism} from "./Isomorphism";
import {IGraph, IVertex, IEdge, Graph, Vertex, Edge} from "graphlabs.core.graphs";

interface Idiv {
    id: string;
}

//const div: StyledFunction<Idiv & HTMLProps<HTMLDivElement>> = styled.div;

class App extends Template {
  public ngraphs: Graph<Vertex, Edge>[] = [];  
  private answer: boolean = false;
    
    constructor(props: {}) {
        super(props);
        this.setYes = this.setYes.bind(this);
        this.setNo = this.setNo.bind(this);
    }

    public componentWillMount() {

      const variantData = sessionStorage.getItem('variant');
      let varianObject: any;

      try {
        const varianObject = JSON.parse(variantData||"null");
      } catch (err) {
          console.log("Error while JSON parsing");
      }

      if (varianObject && varianObject.data[0] && varianObject.data[0].type && varianObject.data[0].type == 'n-graphs') {
          if (varianObject.data[0].value && varianObject.data[0].count) {
              const numberOfGraphs = parseInt(varianObject.data[0].count, 10);
              const letters = ['a','b','c','d','e','f','g'];
              for (let i = 0; i < numberOfGraphs; i++) {
                  if (varianObject.data[0].value.graphs[i]){
                      const graphInCaсhe: Graph<Vertex, Edge> = new Graph();
                      const vertices = varianObject.data[0].value.graphs[i].vertices;
                      const edges  = varianObject.data[0].value.graphs[i].edges;
                      vertices.forEach((v: any) => {
                          graphInCaсhe.addVertex(new Vertex(letters[i] + v));
                          graphModel.addVertex(new Vertex(letters[i] + v));
                      });
                      edges.forEach((e: any) => {
                          graphInCaсhe.addEdge(new Edge(graphInCaсhe.getVertex(letters[i] + e.source)[0], graphInCaсhe.getVertex(letters[i] + e.target)[0]));
                          graphModel.addEdge(new Edge(graphInCaсhe.getVertex(letters[i] + e.source)[0], graphInCaсhe.getVertex(letters[i] + e.target)[0]));
                      });
                      this.ngraphs.push(graphInCaсhe);
                  }
              }
          }
      }

       if (this.ngraphs.length == 0){
          const letters = ['a','b'];
          for (let i = 0; i < 2; i++) {
              const graphInCaсhe: Graph<Vertex, Edge> = new Graph();
              for (let j = 0; j < 5; j++) {
                  graphInCaсhe.addVertex(new Vertex(letters[i] + j.toString()));
                  graphModel.addVertex(new Vertex(letters[i] + j.toString()));
              }
              for (let j = 0; j < 4; j++) {
                  //graphInCaсhe.addEdge(new Edge(graphInCaсhe.getVertex(letters[i] + j.toString())[0], graphInCaсhe.getVertex(letters[i] + (j+1).toString())[0]));
                  graphModel.addEdge(new Edge(graphInCaсhe.getVertex(letters[i] + j.toString())[0], graphInCaсhe.getVertex(letters[i] + (j+1).toString())[0]));
              }
              this.ngraphs.push(graphInCaсhe);
          }
      } 
      
      if (this.ngraphs.length == 2){
          if (Isomorphism.checkNC(this.ngraphs[0], this.ngraphs[1])) {
              this.answer = Isomorphism.checkIsomorphism(this.ngraphs[0], this.ngraphs[1]);
          }
      }

    }

    // public calculate() {
    //     this.answer;
    //
    //     return { success: this.answer === this.studentAnswer, fee: };
    // }

    public getTaskToolbar() {
        Toolbar.prototype.getButtonList = () => {
            ToolButtonList.prototype.help = () => `В данном задании Вы должны определить, являются ли
данные два графа изоморфными.
При выборе ответа необходимо выбрать из списка причину, по которой Вы дали данный ответ.
После выбора ответа нажмите кнопку отправки для проверки задания.
В случае верного указания ответа и причины, Вам будет начислен максимальный балл.
В противном случае Вам будет дана еще одна попытка для изменения варианта ответа и/или обоснования ответа`;
            return ToolButtonList;
        };
        return Toolbar;
    }
    public setYes(){
        // this.studentAnswer;
        //alert("Yes");
    }

    public setNo(){
        //alert("No");
    }

    public task(){

        return () => (

            <form>
                <p><strong>Являются ли графы изоморфными?</strong></p>
                <p><input type="radio" name="answer" value="yes" onClick={this.setYes}/> Да</p>
                <p><input type="radio" name="answer" value="no" onClick={this.setNo} /> Нет</p>
            </form>
        )
    }

    /*
    public render() {
        const Task = this.task();
        const Toolbar = this.getTaskToolbar();
        return (
            <App2 id="wrap">
                {this.state.status
                    ? <p>Задание выполнено. Ожидайте ответа от сервера...</p>
                    : (
                        <div>
                            <MainRow>
                                <GraphCell>
                                    <Adapter/>
                                </GraphCell>
                                <TaskCell>
                                    <p>Задание</p>
                                    <Task/>
                                </TaskCell>
                                <ToolCell>
                                    <Toolbar/>
                                </ToolCell>
                            </MainRow>
                            <LeftBottom>
                                <StudentMark/>
                            </LeftBottom>
                            <LowRow>
                                <TaskConsole/>
                            </LowRow>
                        </div>)}
            </App2>
        )
    }
    */
}
export default App;

/*
const BorderedDiv = styled.div`
  {
    box-shadow:2px 2px 11px rgba(0, 0, 0, 0.5);
    -webkit-box-shadow:2px 2px 11px rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    background: #fffaf0;
  }
`;

const GraphCell = BorderedDiv.extend`
  {
    position: fixed;
    left: 15%;
    top: 1%;
    width: 62%;
    height: 78%;
  }
`;


const ToolCell = BorderedDiv.extend`
  {
     position: fixed;
    left: 1%;
    top: 1%;
    width: 12%;
    height: 78%;
  }
`;

const TaskCell = BorderedDiv.extend`
  {
    position: fixed;
    left: 79%;
    top: 1%;
    width: 20%;
    height: 78%;
  }
`;

const LeftBottom = BorderedDiv.extend`
  {
    position: fixed;
    left: 1%;
    top: 80%;
    width: 12%;
    height: 19%;
  }
`;

const LowRow = BorderedDiv.extend`
  {
    position: fixed;
    left: 15%;
    top: 80%;
    width: 84%;
    height: 19%;
  }
`;



const App2 = div`
  {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
`;

const MainRow = styled.div`
  {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 80%;
  }
`;
*/