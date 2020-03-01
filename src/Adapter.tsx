    
import { CommonGraphAdapter, graphActionCreators, GraphVisualizer} from "graphlabs.core.template";
import {Vertex, Edge, IEdge, IGraph, IVertex} from 'graphlabs.core.graphs';
import {ReadableAdapter, GeometricVertex} from "graphlabs.core.visualizer";
import * as React from 'react';
import { select } from 'd3-selection';
import * as d3 from 'd3';

export declare class Color {
    R: number;
    G: number;
    B: number;
    constructor(R: number, G: number, B: number);
}

export class Adapter extends ReadableAdapter {

    addVertexToSVG(elem: GeometricVertex<Vertex>) {
        
        console.log(this.graphVisualizer);

        select<SVGSVGElement, IVertex[]>(this.ref)
            .append('circle')
            .datum([this.vertexOne, this.vertexTwo])
            .attr('id', `vertex_${elem.label}`)
            .attr('cx', elem.center.X)
            .attr('cy', elem.center.Y)
            .attr('label', elem.label)
            .attr('r', elem.radius)
            .style('fill', '#eee')
            .style('stroke', '#000')
            .style('stroke-width', 5)
            .classed('dragging', true)
            .call(d3.drag<SVGCircleElement, IVertex[]>()
                .on('start', startDrag))
            .on('click', clickVertex);
        select(this.ref)
            .append('text')
            .attr('id', `label_${elem.label}`)
            .attr('x', elem.center.X)
            .attr('y', elem.center.Y + elem.radius / 4)
            .attr('font-size', elem.radius)
            .text(elem.label)
            .style('fill', '#000')
            .style('font-family', 'sans-serif')
            .style('text-anchor', 'middle')
            .style('padding-top', '50%')
            .style('user-select', 'none')
            .style('pointer-events', 'none');
        const referrer = this.ref;
        
        const allVertexArr = this.graphVisualizer.geometric.vertices;
        const allEdgesArr = this.graphVisualizer.geometric.edges;

        function startDrag(this: SVGCircleElement) {
            const circle = d3.select(this).classed('dragging', true);
            d3.event.on('drag', dragged).on('end', ended);
            const radius = parseFloat(circle.attr('r'));

            function dragged(d: any) {
                if (d3.event.x < referrer.getBoundingClientRect().width - radius
                    && d3.event.x > radius
                    && d3.event.y < referrer.getBoundingClientRect().height - radius
                    && d3.event.y > radius) {
                    circle.raise().attr('cx', d3.event.x).attr('cy', d3.event.y);
                    const name = circle.attr('id');
                    const _id = name.substring(7);
                    select(`#label_${_id}`)
                        .raise()
                        .attr('x', d3.event.x)
                        .attr('y', d3.event.y + +circle.attr('r') / 4);
                    d3.selectAll('line').each(function (l: any, li: any) {
                        if (`vertex_${d3.select(this).attr('out')}` === name) {
                            select(this)
                                .attr('x1', d3.event.x)
                                .attr('y1', d3.event.y);
                        }
                        if (`vertex_${d3.select(this).attr('in')}` === name) {
                            select(this)
                                .attr('x2', d3.event.x)
                                .attr('y2', d3.event.y);
                        }
                    });
                }
                //     console.log("ATTENTION!!!");
                // }
            }

            function ended(this: SVGCircleElement) {

                //let str = "";
                
                let LabelA = "";
                let allVertexA = [];
                let allVertexB = [];
                let coloredVertexPair = Array<{vALable: string, vBLable: string}>();
                
                for (const elem of allVertexArr){
                    if (allVertexA.length == 0){
                        LabelA = elem.label[0];
                        allVertexA.push(elem);
                        select(`#vertex_${elem.label}`).style('stroke', '#DB3E00');
                        //str += " ;A+" + elem.label;
                    } else if (elem.label[0] == LabelA){
                        allVertexA.push(elem);
                        select(`#vertex_${elem.label}`).style('stroke', '#DB3E00');
                        //str += " A+" + elem.label;
                    } else {
                        allVertexB.push(elem);
                        select(`#vertex_${elem.label}`).style('stroke', '#1A237E');
                        //str += " B+" + elem.label;
                    }
                    //select(`#vertex_${elem.label}`).style('stroke', '#000000');
                }

                for (const vA of allVertexA){

                    var vALable= vA.label;
                    var aX= Number(referrer.getElementById('vertex_'+vALable).getAttribute('cx'));
                    var aY= Number(referrer.getElementById('vertex_'+vALable).getAttribute('cy'));
                    var aR= Number(referrer.getElementById('vertex_'+vALable).getAttribute('r'));
                    

                    for (const vB of allVertexB){
                        
                        var vBLable= vB.label;
                        var bX= Number(referrer.getElementById('vertex_'+vBLable).getAttribute('cx'));
                        var bY= Number(referrer.getElementById('vertex_'+vBLable).getAttribute('cy'));
                        var bR= Number(referrer.getElementById('vertex_'+vBLable).getAttribute('r'));

                        if (Math.hypot(Math.abs(aX - bX),Math.abs(aY - bY)) < aR + bR){
                            //select(`#vertex_${vALable}`).style('stroke', '#00ff00');
                            //select(`#vertex_${vBLable}`).style('stroke', '#00ff00');
                            coloredVertexPair.push({vALable, vBLable}); 
                        }
                    } 
                }

                coloredVertexPair = coloredVertexPair.filter(vp => coloredVertexPair.filter(fpv => fpv.vALable == vp.vALable).length < 2 
                                                                && coloredVertexPair.filter(fpv => fpv.vBLable == vp.vBLable).length < 2);
                coloredVertexPair.forEach(vp => {
                    select(`#vertex_${vp.vALable}`).style('stroke', 'green');
                    select(`#vertex_${vp.vBLable}`).style('stroke', 'green');
                });
                
                allEdgesArr.forEach( edge => {
                    if (coloredVertexPair.find( vp => vp.vALable == edge.edge.vertexOne.name || vp.vBLable == edge.edge.vertexOne.name)
                     && coloredVertexPair.find( vp => vp.vALable == edge.edge.vertexTwo.name || vp.vBLable == edge.edge.vertexTwo.name)){
                        select(`#edge_${edge.edge.vertexOne.name}_${edge.edge.vertexTwo.name}`).style('stroke', 'green');     
                    } else {
                        if (edge.edge.vertexOne.name[0] == LabelA){
                            select(`#edge_${edge.edge.vertexOne.name}_${edge.edge.vertexTwo.name}`).style('stroke', '#DB3E00');
                        } else {
                            select(`#edge_${edge.edge.vertexOne.name}_${edge.edge.vertexTwo.name}`).style('stroke', '#1A237E');
                        } 
                    }
                });

                //alert("x=" + d3.event.x.toString() +" ; y=" + d3.event.y.toString() + " ; name=" + circle.attr('id') + " ; r=" + radius + " ; lenght=" + allVertexArr.length + " ; str=" + str );
                //alert("color=" + LabelA + "str " + str);

                circle.classed('dragging', false);
            }
        }

        function clickVertex(this: SVGCircleElement, vertexArr: IVertex[]) {
            let elemColour = select<SVGCircleElement, {}>(this).style("fill");
            if (elemColour === 'rgb(255, 255, 0)') {
                select<SVGCircleElement, {}>(this)
                    .style('fill', '#eee');
                if (this.getAttribute('label') == vertexArr[0].name) {
                    vertexArr[0].rename('');
                } else if (this.getAttribute('label') == vertexArr[1].name) {
                    vertexArr[1].rename('');
                }
            } else {
                select<SVGCircleElement, {}>(this)
                    .style('fill', '#ffff00');
                if (vertexArr[0].name == '') {
                    vertexArr[0].rename(this.getAttribute('label') || "null");
                } else if (vertexArr[1].name == '') {
                    vertexArr[1].rename(this.getAttribute('label') || "null");
                } else if (vertexArr[0].name !== '' && vertexArr[1].name !== '') {
                    vertexArr[1].rename('');
                    vertexArr[0].rename(this.getAttribute('label') || "null");
                }
            }
        }       
    }

    componentDidMount() {
        super.componentDidMount();

        let LabelA = "";
        const allEdgesArr = this.graphVisualizer.geometric.edges;

        for (const elem of this.graphVisualizer.geometric.vertices){
            if (LabelA == ""){
                LabelA = elem.label[0];
                select(`#vertex_${elem.label}`).style('stroke', '#DB3E00');
            } else if (LabelA == elem.label[0]){
                select(`#vertex_${elem.label}`).style('stroke', '#DB3E00');
            } else if (LabelA != elem.label[0]){
                select(`#vertex_${elem.label}`).style('stroke', '#1A237E');
            }         
        }

        d3.selectAll('line').each(function(d, i) {
            let out_v = d3.select(this).attr('out'); // вершина 1
            let in_v = d3.select(this).attr('in'); // вершина 2
            //alert("out_v = " + out_v + "in_v" + in_v);
            if (in_v[0] == LabelA){
                d3.select(this).style('stroke', '#DB3E00')
            } else {
                d3.select(this).style('stroke', '#1A237E')
            }
        }); // перекраска дефолтного цвета
        
    }

}