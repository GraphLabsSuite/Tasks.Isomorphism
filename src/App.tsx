import * as React from 'react';
import {store, GraphVisualizer, Template, Toolbar, ToolButtonList} from 'graphlabs.core.template';
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
    private answer: boolean = false;

    constructor(props: {}) {
        super(props);
        this.setYes = this.setYes.bind(this);
        this.setNo = this.setNo.bind(this);
    }

    public componentWillMount() {

        /*
        const obj = GraphLoader.parseFromStr();
        const graph1 : Graph<Vertex, Edge>  = GraphLoader.createGraph(obj , 0);
        graph1.vertices.forEach(v => store.dispatch(actionsCreators.addVertex(v.name)));
        graph1.edges.forEach(e => store.dispatch(actionsCreators.addEdge(e.vertexOne.name, e.vertexTwo.name)));

        const graph2 : Graph<Vertex, Edge>= GraphLoader.createGraph(obj , 1);
        graph2.vertices.forEach(v => store.dispatch(actionsCreators.addVertex(v.name)));
        graph2.edges.forEach(e => store.dispatch(actionsCreators.addEdge(e.vertexOne.name, e.vertexTwo.name)));
 
        if (Isomorphism.checkNC(graph1,graph2)) {
            this.answer = Isomorphism.checkIsomorphism(graph1,graph2);
        }
        */
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
        alert("Yes");
    }

    public setNo(){
        alert("No");
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