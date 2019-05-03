import {CommonGraphAdapter} from "graphlabs.core.template"
import * as React from 'react';
import {select, style} from 'd3-selection';
import * as d3 from 'd3';
import {actionsCreators} from "graphlabs.core.template";
import {RootState} from "graphlabs.core.template/build/redux/rootReducer";
import {IGraphView} from "graphlabs.core.template/build/models/graph";
import {store} from "graphlabs.core.template";
import {number} from "prop-types";
import {Selection} from "d3-selection";

export class Adapter extends CommonGraphAdapter {
    public storeVertices: string[];

    constructor(props: {}) {
        super(props);
        this.storeVertices = [];
        this.renderSvg = this.renderSvg.bind(this);
        this.checkIntersection = this.checkIntersection.bind(this);
    }

    public renderSvg() {
        this.graphVisualizer.width = this.ref.clientWidth;
        this.graphVisualizer.height = this.ref.clientHeight;
        this.graphVisualizer.calculate();
        for (const elem of this.graphVisualizer.geometric.edges) {
            const data = [{x: elem.outPoint.X, y: elem.outPoint.Y}, {x: elem.inPoint.X, y: elem.inPoint.Y}];
            if (elem.edge.vertexOne.name[0] === "a") {
                select<SVGSVGElement, {}>(this.ref)
                    .append('line')
                    .attr('id', `edge_${elem.edge.vertexOne.name}_${elem.edge.vertexTwo.name}`)
                    .attr('out', elem.edge.vertexOne.name)
                    .attr('in', elem.edge.vertexTwo.name)
                    .attr('x1', data[0].x)
                    .attr('x2', data[1].x)
                    .attr('y1', data[0].y)
                    .attr('y2', data[1].y)
                    .style('stroke', '#DB3E00')
                    .style('stroke-width', 5)
                    .style('fill', 'none')
                    .on('click', this.clickEdge.bind(this));
            }else{
                select<SVGSVGElement, {}>(this.ref)
                    .append('line')
                    .attr('id', `edge_${elem.edge.vertexOne.name}_${elem.edge.vertexTwo.name}`)
                    .attr('out', elem.edge.vertexOne.name)
                    .attr('in', elem.edge.vertexTwo.name)
                    .attr('x1', data[0].x)
                    .attr('x2', data[1].x)
                    .attr('y1', data[0].y)
                    .attr('y2', data[1].y)
                    .style('stroke', '#1A237E')
                    .style('stroke-width', 5)
                    .style('fill', 'none')
                    .on('click', this.clickEdge.bind(this));
            }
        }
        for (const elem of this.graphVisualizer.geometric.vertices) {
            if (elem.vertex.name[0] === "a") {
                select<SVGSVGElement, {}>(this.ref)
                    .append<SVGCircleElement>('circle')
                    .attr('id', `vertex_${elem.label}`)
                    .attr('cx', elem.center.X)
                    .attr('cy', elem.center.Y)
                    .attr('r', elem.radius)
                    .style('fill', '#eee')
                    .style('stroke', '#DB3E00')
                    .style('stroke-width', 5)
                    .classed('dragging', true)
                    .call(d3.drag<SVGCircleElement, {}>()
                        .on('start', startDrag)
                        .on('end',end.bind(this)))
                    .on('click', this.clickVertex.bind(this));
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
                    .style('pointer-events', 'none')
            }else{
                select<SVGSVGElement, {}>(this.ref)
                    .append<SVGCircleElement>('circle')
                    .attr('id', `vertex_${elem.label}`)
                    .attr('cx', elem.center.X)
                    .attr('cy', elem.center.Y)
                    .attr('r', elem.radius)
                    .style('fill', '#eee')
                    .style('stroke', '#1A237E')
                    .style('stroke-width', 5)
                    .classed('dragging', true)
                    .call(d3.drag<SVGCircleElement, {}>()
                        .on('start', startDrag)
                        .on('end', end.bind(this)))
                    .on('click', this.clickVertex.bind(this));
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
                    .style('pointer-events', 'none')
            }
        }

        function end(this: Adapter) {
           this.checkIntersection();
        }

        function startDrag(this: SVGCircleElement) {
            const circle =
                d3.select(this).classed('dragging', true);
            d3.event.on('drag', dragged);
            function dragged(this: SVGSVGElement) {
                circle.raise().attr('cx', d3.event.x).attr('cy', d3.event.y);
                const name = circle.attr('id');
                const id = name.substring(7);
                // tslint:disable
                select(`#label_${id}`)
                    .raise()
                    .attr('x', d3.event.x)
                    .attr('y', d3.event.y + +circle.attr('r') / 4);

                d3.selectAll('line').each(function(d, i) {
                    let out_vertex = "vertex_" + d3.select(this).attr('out');
                    let in_vertex = "vertex_" + d3.select(this).attr('in');
                    if (out_vertex === name) {
                                d3.select(this)
                                    .attr('x1', d3.event.x)
                                    .attr('y1', d3.event.y);
                            }
                    if (in_vertex === name) {
                                d3.select(this)
                                    .attr('x2', d3.event.x)
                                    .attr('y2', d3.event.y);
                            }

                });
            }
            function ended() {
                circle.classed('dragging', false);
            }
        }
    }

    public updateSvg() {
        this.graphVisualizer.width = this.ref.clientWidth;
        this.graphVisualizer.height = this.ref.clientHeight;
        this.graphVisualizer.calculate();
        for (const elem of this.graphVisualizer.geometric.vertices) {
            select(`#vertex_${elem.label}`)
                .attr('cx', elem.center.X)
                .attr('cy', elem.center.Y)
                .attr('fill', 'black')
                .attr('r', elem.radius);
            select(`#label_${elem.label}`).raise().attr('x', elem.center.X).attr('y', elem.center.Y);
        }

        for (const elem of this.graphVisualizer.geometric.edges) {
            select(`#edge_${elem.edge.vertexOne.name}_${elem.edge.vertexTwo.name}`)
                .attr('x1', elem.outPoint.X)
                .attr('x2', elem.inPoint.X)
                .attr('y1', elem.outPoint.Y)
                .attr('y2', elem.inPoint.Y);
        }
    }

    public checkIntersection()
    {
        const checked: VertexView[]=[];
        const output: string[]=[];
        interface VertexView {
            x: number;
            y: number;
            r: number;
            name: string;
        }
        const i : VertexView = {x : 0, y: 0, r : 0, name :""};
        for (const elem of this.graphVisualizer.geometric.vertices)
        {
            const str = 'vertex_'+elem.label;
            const node = this.ref.getElementById(str) as SVGCircleElement;
            i.x = node.cx.baseVal.value;
            i.y = node.cy.baseVal.value;
            i.r = node.r.baseVal.value;
            i.name=elem.label;
            for (const vertex of checked)
            {
                if(Math.hypot(Math.abs(i.x-vertex.x),Math.abs(i.y-vertex.y))<i.r+vertex.r)
                {
                    output.push(vertex.name,i.name);
                    checked.splice(checked.indexOf(vertex),1);
                    if(vertex.name[0] !== i.name[0])
                    {
                        select(`#vertex_${elem.label}`)
                            .style('stroke', 'green');
                        select(`#vertex_${vertex.name}`)
                            .style('stroke', 'green');
                    }
                    else
                    {
                        if (vertex.name[0] === 'a')
                        {
                            select(`#vertex_${elem.label}`)
                                .style('stroke', '#DB3E00');
                            select(`#vertex_${vertex.name}`)
                                .style('stroke', '#DB3E00');
                        }
                        else
                        {
                            select(`#vertex_${elem.label}`)
                                .style('stroke', '#1A237E');
                            select(`#vertex_${vertex.name}`)
                                .style('stroke', '#1A237E');
                        }

                    }

                }
            }
            checked.push(Object.assign({},i));
        }
        if (this.storeVertices.length >= output.length)
        {
            this.storeVertices.forEach((item: any) => {
                if (output.indexOf(item) === -1) {
                    if (item[0] === 'a') { select(`#vertex_${item}`)
                        .style('stroke', '#DB3E00');
                    }
                    if (item[0] === 'b') { select(`#vertex_${item}`)
                        .style('stroke', '#1A237E');
                    }
                }
            });

        }
        d3.selectAll('line').each(function(d, i) {
            let flag = 0;
            let out_v1 = d3.select(this).attr('out');
            let in_v1 = d3.select(this).attr('in');
            if( out_v1[0] === 'a'){
                d3.selectAll('line').each(function(d, i) {
                    let out_v2 = d3.select(this).attr('out');
                    let in_v2 = d3.select(this).attr('in');
                    if( out_v2[0] === 'b'){
                        if((output.indexOf(out_v2) === output.indexOf(out_v1) + 1 && output.indexOf(in_v2) === output.indexOf(in_v1) + 1)
                        || (output.indexOf(out_v2) === output.indexOf(in_v1) + 1 && output.indexOf(in_v2) === output.indexOf(out_v1) + 1 )){
                            d3.select(this).style('stroke', 'green');
                            flag = 1;
                        }
                    }
                });
                if (flag === 1) d3.select(this).style('stroke','green');
            }
        }); // покраска ребер в зеленый
        d3.selectAll('line').each(function(d, i) {
            let flag = 0;
            let out_v = d3.select(this).attr('out'); // вершина 1
            let in_v = d3.select(this).attr('in'); // вершина 2
            if (select(`#vertex_${out_v}`).style('stroke') !== 'green'
                ||select(`#vertex_${in_v}`).style('stroke') !== 'green')
            {
                if (out_v[0] === 'a') {
                    d3.select(this).style('stroke', '#DB3E00')
                }
                if (out_v[0] === 'b') {
                    d3.select(this).style('stroke', '#1A237E')
                }
            }
        }); // возвращение дефолтного цвета

       // alert(this.storeVertices.toString());
        // alert(output.toString());
        this.storeVertices = output;

    }
}
