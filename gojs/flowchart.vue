<template>
  <EditorHeader @undo="undo" @redo="redo" @downloadImage="downloadImage" @saveDoc="saveDoc" @getTitle = 'getTitle'></EditorHeader>
  <div class="layout-center">
    <CanvasTool :myDiagram="myDiagram" @handleTab="handleTab"></CanvasTool>
    <div id="myDiagramDiv" :style="`background: ${bgColor}`"></div>
    <RightBar
      @changeProperty="changeProperty"
      @changeBGColor="changeBGColor"
      @diagramFuction="diagramFuction"
      @replaceElement="replaceElement"
    ></RightBar>
  </div>
  <ContextMenu @hideContextMenu="hideContextMenu"></ContextMenu>
  <div class="layout-bottom">
    <el-popover
      placement="top-start"
      :width="200"
      trigger="click"
    >
      <template #reference>
        <dd class="iconfont icon-yingyanzhankai"></dd>
      </template>
      <div
        id="myOverviewDiv"
        :style="`background: ${bgColor}`"
      ></div>
    </el-popover>
    <dd class="iconfont icon-dingwei" @click="contentAlign()"></dd>
  </div>

</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue'
// import go from 'gojs'
import EditorHeader from './EditorHeader.vue'
import CanvasTool from './CanvasTool.vue'
import RightBar from './RightBar.vue'
import ContextMenu from './ContextMenu.vue'

import screenfull from 'screenfull'
import { newProcessSave, editProcess, processList } from "@/service/api.ts";
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter()
import {
  shapesArray,
  healthArray,
  officeArray,
  financeArray,
  greenArray,
  threediconArray,
  array1, array2, array3, array4
} from "@/config/getAllPaletteSvg";
const iconGroup = ["图形", "健康", "办公", "环保", "绿色", '3D','办公','医疗', '电商', '金融']

let myDiagram: any = ref()
let myPalette: any
let loc: any, canvasPos: any, fromNode : any

let tabModel = ref(0)
let title = ref()
let currentArray = ref(shapesArray)
let bgColor = ref()
let obj = reactive({
  nodedata: { 
    class: "GraphLinksModel",
    nodeDataArray: [],
    linkDataArray: []
  }
})
const getTitle = (tit: any) => {
  console.log(tit)
  title.value = tit
  
}
const undo = () => {
  myDiagram.commandHandler.undo();
}
const redo = () => {
  myDiagram.commandHandler.redo();
}
const downloadImage = () => {
  myDiagram.makeImageData({
    background: bgColor.value,
    returnType: "blob",
    callback: myCallback,
  });
}
const diagramId = route.query.diagramId;

//修改节点属性
const changeProperty = (p: object) => {
  console.log("修改属性：", p);
  changeNodeStyle(p);
};
let textStyle = () => {
  return {
    font: "14pt Lato, Helvetica, Arial, sans-serif",
    stroke: '#000',
  };
}
const replaceElement = (shape: any) => {
  myDiagram.selection.each((node: any) => {
    if (node instanceof go.Node) {
      var data = node.data;
      console.log(data)
      if(shape.geo) {
        myDiagram.model.setDataProperty(data, "geo", shape.geo);
        myDiagram.model.setDataProperty(data, "geometryString", shape.geo);
        
      }else {
        myDiagram.startTransaction("change shape");
        myDiagram.model.setDataProperty(data, "source", shape.source);
        myDiagram.model.setDataProperty(data, "shape", shape.shape);
      }
      
     
    }
  })
}
const changeNodeStyle = (p: object) => {
  myDiagram.selection.each((node) => {
    if (node instanceof go.Node) {
      var data = node.data;
      myDiagram.startTransaction("change style");
      var key = Object.keys(p)[0];
      console.log(key,)
      if (key.indexOf("font") > -1) {
        data.fontFamily = p.fontFamily || data.fontFamily || "PingFang SC , 微软雅黑";
        data.fontSize = p.fontSize || data.fontSize || "20px";
        data.fontWeight =
          p.fontWeight != undefined ? p.fontWeight : data.fontWeight || "";
        data.fontItalic =
          p.fontItalic != undefined ? p.fontItalic : data.fontItalic || "";
        // let fontUnderline = p.fontUnderline || data.fontUnderline || "";
        // let fontDelete = p.fontDelete || data.fontDelete || "";
        let font =
          data.fontItalic +
          " " +
          data.fontWeight +
          " " +
          // fontUnderline +
          // " " +
          // fontDelete +
          // " " +
          data.fontSize +
          " " +
          data.fontFamily;
        console.log(font,data);
        myDiagram.model.setDataProperty(data, "font", font);
        
      } else {
        console.log(data);
        myDiagram.model.setDataProperty(data, key, p[key]);
      }
      myDiagram.commitTransaction("change style");
    }
  });
};
//获取流程图一个数据
const initData = () => {
  if (diagramId) {
    let params = {
      hhxsProcessonFlag: 0,
      hhxsProcessonId: diagramId,
    };
    processList(params).then((res: any) => {
      console.log(111, res);
      if (res) {
        const model = res[0].hhxsProcessonData;
        myDiagram.model = go.Model.fromJson(model);
        title.value = res[0].hhxsProcessonName
       
        //load();
      }
    });
  }
  console.log(obj.nodedata,'obj.nodedata');
  
};

const saveDoc = () => {
  const diagramId = route.query.diagramId;
  let params = {
      hhxsProcessonAvatar: '',
      hhxsProcessonData: myDiagram.model.toJson(),
      hhxsProcessonName: title.value,
      hhxsProcessonBgcolor: "#ffffff",
      hhxsProcessonType: 2,
      hhxsProcessonId: '',

    };

    if (!diagramId) {
      newProcessSave(params).then((data: any) => {
        console.log("新建成功", data);
        const pId = data.hhxsProcessonId;
        router.replace({
          name: "EditorPage",
          query: { diagramId: pId },
        });
      });
    } else {
      params.hhxsProcessonId = Number(diagramId)
      editProcess(params).then((data: any) => {
        console.log("修改", data);
      });
    }
}
const myCallback = (blob: any) => {
  var url = window.URL.createObjectURL(blob);
  var filename = "myFlowChart.png";

  var a: any = document.createElement("a");
  a.style = "display: none";
  a.href = url;
  a.download = filename;

  // IE 11
  if (window.navigator.msSaveBlob !== undefined) {
    window.navigator.msSaveBlob(blob, filename);
    return;
  }

  document.body.appendChild(a);
  requestAnimationFrame(function () {
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  });
}
const contentAlign = () => {
    myDiagram.contentAlignment = go.Spot.Center;
    myDiagram.alignDocument(go.Spot.Center, go.Spot.Center);
    myDiagram.contentAlignment = go.Spot.Default;
}
const diagramFuction = (type: string) => {
  if(type === 'zoomOut') {
    myDiagram.commandHandler.increaseZoom();
  }
  if(type === 'zoomIn') {
    myDiagram.commandHandler.decreaseZoom();
  }
  if(type === 'fullscreen') {
    console.log(myDiagram.commandHandler)
    if (!screenfull.isEnabled) {
      return false;
    }
    screenfull.toggle();
  }
}
const changeBGColor = (color: string) => {
  bgColor.value = color
}
const handleTab = (index: number) => {
  console.log(index,'index');
  
  tabModel.value = index
}

watch(
  tabModel,
  (val) => {
     if(val === 0) {
       myPalette.model = new go.GraphLinksModel(shapesArray)
     } else if(val === 1) {
       myPalette.model = new go.GraphLinksModel(healthArray)
     } else if (val === 2) {
        myPalette.model = new go.GraphLinksModel(officeArray);
      } else if (val === 3) {
        myPalette.model = new go.GraphLinksModel(financeArray);
      } else if (val === 4) {
        myPalette.model = new go.GraphLinksModel(greenArray);
      } else if (val === 5) {
        myPalette.model = new go.GraphLinksModel(threediconArray);
      } else if (val === 6) {
        myPalette.model = new go.GraphLinksModel(array1);
      } else if (val === 7) {
        myPalette.model = new go.GraphLinksModel(array2);
      } else if (val === 8) {
        myPalette.model = new go.GraphLinksModel(array3);
      } else if (val === 9) {
        myPalette.model = new go.GraphLinksModel(array4);
      }
  }
)

const init = () => {
    // Since 2.2 you can also author concise templates with method chaining instead of GraphObject.make
  // For details, see https://gojs.net/latest/intro/buildingObjects.html
  const $ = go.GraphObject.make
  
  myDiagram =
    $(go.Diagram, "myDiagramDiv",
      { 
        scale: 1,
        minScale: 0.5,
        maxScale: 1.5,
        padding: 20,  // extra space when scrolled all the way
        grid: $(go.Panel, "Grid",  // a simple 10x10 grid
          $(go.Shape, "LineH", { stroke: "lightgray", strokeWidth: 0.5 }),
          $(go.Shape, "LineV", { stroke: "lightgray", strokeWidth: 0.5 })
        ),
        "draggingTool.isGridSnapEnabled": true,
        handlesDragDropForTopLevelParts: true,
        mouseDrop: e => {
          // when the selection is dropped in the diagram's background,
          // make sure the selected Parts no longer belong to any Group
          var ok = e.diagram.commandHandler.addTopLevelParts(e.diagram.selection, true)
          if (!ok) e.diagram.currentTool.doCancel()
        },
        click: function () {
          hideContextMenu(null)
        },
        // commandHandler: $(DrawCommandHandler),  // support offset copy-and-paste
        "clickCreatingTool.archetypeNodeData": { text: "项目名称" },  // create a new node by double-clicking in background
        "clickCreatingTool.insertPart": function (loc: any) {
          loc = loc;
          canvasPos = this;
          fromNode = null;
          showContextMenu(loc);
        },
        "linkingTool.doNoLink": function (fromNode: any) {
          // console.log(myDiagram.lastInput.viewPoint);
          canvasPos = this;
          fromNode = fromNode;
          showContextMenu(null);

          loc = myDiagram.lastInput.documentPoint;
        },
        "PartCreated": e => {
          var node = e.subject  // the newly inserted Node -- now need to snap its location to the grid
          node.location = node.location.copy().snapToGridPoint(e.diagram.grid.gridOrigin, e.diagram.grid.gridCellSize)
          setTimeout(() => {  // and have the user start editing its text
            e.diagram.commandHandler.editTextBlock()
          }, 20)
        },
        "commandHandler.archetypeGroupData": { isGroup: true, text: "NEW GROUP" },
        "SelectionGrouped": e => {
          var group = e.subject
          setTimeout(() => {  // and have the user start editing its text
            e.diagram.commandHandler.editTextBlock()
          })
        },
        "LinkRelinked": e => {
          // re-spread the connections of other links connected with both old and new nodes
          var oldnode = e.parameter.part
          oldnode.invalidateConnectedLinks()
          var link = e.subject
          if (e.diagram.toolManager.linkingTool.isForwards) {
            link.toNode.invalidateConnectedLinks()
          } else {
            link.fromNode.invalidateConnectedLinks()
          }
        },
        "undoManager.isEnabled": true
      })
  myDiagram.toolManager.mouseDownTools.insertAt(3,
      $(GeometryReshapingTool, { isResegmenting: true }));
  // Node template
  myDiagram.nodeTemplate =
    $(go.Node,
        {
          resizable: true, resizeObjectName: "SHAPE",
          reshapable: true,  // GeometryReshapingTool assumes nonexistent Part.reshapeObjectName would be "SHAPE"
          rotatable: true, rotationSpot: go.Spot.Center,
         
        },
       
        // {
        //   locationSpot: go.Spot.Center,
        //   locationObjectName: "SHAPE",
        //   desiredSize: new go.Size(120, 120),
        //   minSize: new go.Size(50, 50),
        //   resizable: true,
        //   reshapable: true, 
        //   rotationSpot: go.Spot.Center,
        //   rotatable: true,
        //   // resizeCellSize: new go.Size(20, 20),
        // },
        
       
        
        $(
          go.Panel,
          "Table",
          new go.Binding("visible", "shape", function (i) {
            return i;
          }),
          // $(
          //   go.Picture,
          //   {
          //     imageStretch: go.GraphObject.Fill,
          //   },
          //   new go.Binding("source").makeTwoWay()
          // ),
          $(go.Shape,
          { name: "SHAPE", fill: "lightgray", strokeWidth: 1.5, desiredSize: new go.Size(120, 120) },
          new go.Binding("strokeWidth"),
          new go.Binding("stroke"),
          new go.Binding("fill"),
          new go.Binding("geometryString", "geo").makeTwoWay(),
          ),
            
          $(
            go.TextBlock,
            "项目名称",
            textStyle(),
            {
              margin: 2,
              textAlign: "center",
              overflow: go.TextBlock.OverflowEllipsis,
              editable: true,
            },
            new go.Binding("stroke", "color", (color) => {
              return color || $qmNodeTextDefalut;
            }),
            new go.Binding("font", "font", (font) => {
              return font || "30pt PingFang SC , 微软雅黑";
            }),
            new go.Binding("isUnderline", "isUnderline"),
            new go.Binding("isStrikethrough", "isStrikethrough"),
            new go.Binding("text").makeTwoWay()
          )
        ),

        $(
          go.Panel,
          "Vertical",
          new go.Binding("visible", "shape", function (i) {
            return !i;
          }),
          $(
            go.Picture,
            {
              // imageStretch: go.GraphObject.Fill,
              width: 50,
              height: 50,
            },
            new go.Binding("source").makeTwoWay()
          ),
          $(
            go.TextBlock,
            "项目名称",
            textStyle(),
            {
              margin: 2,
              maxSize: new go.Size(160, NaN),
              overflow: go.TextBlock.OverflowEllipsis,
              textAlign: "center",
              editable: true,
            },
            new go.Binding("stroke", "color", (color) => {
              return color || $qmNodeTextDefalut;
            }),
            new go.Binding("font", "font", (font) => {
              return font || "30pt PingFang SC , 微软雅黑";
            }),
            new go.Binding("isUnderline", "isUnderline"),
            new go.Binding("isStrikethrough", "isStrikethrough"),
            new go.Binding("text").makeTwoWay()
          )
        ),
       
      )
  function showContextMenu(obj: any) {
    console.log(obj,'showContextMenu');

    // This is the actual HTML context menu:
    // verticaltab = 0;

    var cxElement = document.getElementById("contextMenu") as HTMLElement

    // Show only the relevant buttons given the current state.
    // var cmd = diagram.commandHandler;

    // Now show the whole context menu element
    cxElement.classList.add("show-menu");
    // we don't bother overriding positionContextMenu, we just do it here:
    var mousePt = myDiagram.lastInput.viewPoint;
    cxElement.style.left = mousePt.x + 20 + "px";
    cxElement.style.top = mousePt.y + "px";
  }
  
  function makePort(name, spot, output, input) {
    // the port is basically just a small transparent circle
    var $ = go.GraphObject.make;
    return $(go.Shape, "Circle", {
      fill: null, // not seen, by default; set to a translucent gray by showSmallPorts, defined below
      stroke: null,
      desiredSize: new go.Size(6, 6),
      alignment: spot, // align the port on the main Shape
      alignmentFocus: spot, // just inside the Shape
      portId: name, // declare this object to be a "port"
      fromSpot: spot,
      toSpot: spot, // declare where links may connect at this port
      fromLinkable: output,
      toLinkable: input, // declare whether the user may draw links to/from here
      cursor: "pointer", // show a different cursor to indicate potential link point
    });
  }
  function showSmallPorts(node, show) {
    node.ports.each(function (port) {
      if (port.portId !== "") {
        // don't change the default port, which is the big shape
        port.fill = show ? "rgba(61,124,255,.7)" : null;
      }
    });
  }
  myDiagram.nodeTemplate.toolTip =
    $("ToolTip",  // show some detailed information
      $(go.Panel, "Vertical",
        { maxSize: new go.Size(200, NaN) },  // limit width but not height
        $(go.TextBlock,
          { font: "bold 10pt sans-serif", textAlign: "center" },
          new go.Binding("text")),
        $(go.TextBlock,
          { font: "10pt sans-serif", textAlign: "center" },
          new go.Binding("text", "details"))
      )
    )

  // Node selection adornment
  // Include four large triangular buttons so that the user can easily make a copy
  // of the node, move it to be in that direction relative to the original node,
  // and add a link to the new node.

  function makeArrowButton(spot, fig) {
    
    var maker = (e, shape) => {
        e.handled = true
        e.diagram.model.commit(m => {
          var selnode = shape.part.adornedPart
          // create a new node in the direction of the spot
          var p = new go.Point().setRectSpot(selnode.actualBounds, spot)
          p.subtract(selnode.location)
          p.scale(2, 2)
          p.x += Math.sign(p.x) * 60
          p.y += Math.sign(p.y) * 60
          p.add(selnode.location)
          fromNode = selnode
          loc = p
          showContextMenu(null)

          // p.snapToGridPoint(e.diagram.grid.gridOrigin, e.diagram.grid.gridCellSize)
          // // make the new node a copy of the selected node
          // var nodedata = m.copyNodeData(selnode.data)
          // // add to same group as selected node
          // m.setGroupKeyForNodeData(nodedata, m.getGroupKeyForNodeData(selnode.data))
          // m.addNodeData(nodedata)  // add to model
          // // create a link from the selected node to the new node
          // var linkdata = { from: selnode.key, to: m.getKeyForNodeData(nodedata) }
          // m.addLinkData(linkdata)  // add to model
          // // move the new node to the computed location, select it, and start to edit it
          // var newnode = e.diagram.findNodeForData(nodedata)
          // newnode.location = p
          // e.diagram.select(newnode)
          // setTimeout(() => {
          //   e.diagram.commandHandler.editTextBlock()
          // }, 20)
        })
      }
    return $(go.Shape,
      {
        figure: fig,
        alignment: spot, alignmentFocus: spot.opposite(),
        width: (spot.equals(go.Spot.Top) || spot.equals(go.Spot.Bottom)) ? 14 : 12,
        height: (spot.equals(go.Spot.Top) || spot.equals(go.Spot.Bottom)) ? 12 : 14,
        fill: "#7a8eff", 
        strokeWidth: 0,
        isActionable: true,  // needed because it's in an Adornment
        click: maker, 
        contextClick: maker
      })
  }

  // create a button that brings up the context menu
  function CMButton(options) {
    return $(go.Shape,
      {
        fill: "blue", stroke: "gray", background: "transparent",
        geometryString: "F1 M0 0 M0 4h4v4h-4z M6 4h4v4h-4z M12 4h4v4h-4z M0 12",
        isActionable: true, cursor: "context-menu",
        click: (e, shape) => {
          console.log(shape.part.adornedPart, 'shape.part.adornedPart')
          e.diagram.commandHandler.showContextMenu(shape.part.adornedPart)
        }
      },
      options || {})
  }

  myDiagram.nodeTemplate.selectionAdornmentTemplate =
    $(go.Adornment, "Spot",
      $(go.Placeholder, { padding: 10 }),
      makeArrowButton(go.Spot.Top, "TriangleUp"),
      makeArrowButton(go.Spot.Left, "TriangleLeft"),
      makeArrowButton(go.Spot.Right, "TriangleRight"),
      makeArrowButton(go.Spot.Bottom, "TriangleDown"),
      // CMButton({ alignment: new go.Spot(1, 0) })  //
    )

  // Common context menu button definitions

  // All buttons in context menu work on both click and contextClick,
  // in case the user context-clicks on the button.
  // All buttons modify the node data, not the Node, so the Bindings need not be TwoWay.

  // A button-defining helper function that returns a click event handler.
  // PROPNAME is the name of the data property that should be set to the given VALUE.
  function ClickFunction(propname, value) {
    return (e, obj) => {
        e.handled = true  // don't let the click bubble up
        e.diagram.model.commit(m => {
          m.set(obj.part.adornedPart.data, propname, value)
        })
      }
  }

  // Create a context menu button for setting a data property with a color value.
  function ColorButton(color, propname) {
    if (!propname) propname = "color"
    return $(go.Shape,
      {
        width: 16, height: 16, stroke: "lightgray", fill: color,
        margin: 1, background: "transparent",
        mouseEnter: (e, shape) => shape.stroke = "dodgerblue",
        mouseLeave: (e, shape) => shape.stroke = "lightgray",
        click: ClickFunction(propname, color), contextClick: ClickFunction(propname, color)
      })
  }

  function LightFillButtons() {  // used by multiple context menus
    return [
      $("ContextMenuButton",
        $(go.Panel, "Horizontal",
          ColorButton("white", "fill"), ColorButton("beige", "fill"), ColorButton("aliceblue", "fill"), ColorButton("lightyellow", "fill")
        )
      ),
      $("ContextMenuButton",
        $(go.Panel, "Horizontal",
          ColorButton("lightgray", "fill"), ColorButton("lightgreen", "fill"), ColorButton("lightblue", "fill"), ColorButton("pink", "fill")
        )
      )
    ]
  }

  function DarkColorButtons() {  // used by multiple context menus
    return [
      $("ContextMenuButton",
        $(go.Panel, "Horizontal",
          ColorButton("black"), ColorButton("green"), ColorButton("blue"), ColorButton("red")
        )
      ),
      $("ContextMenuButton",
        $(go.Panel, "Horizontal",
          ColorButton("brown"), ColorButton("magenta"), ColorButton("purple"), ColorButton("orange")
        )
      )
    ]
  }

  // Create a context menu button for setting a data property with a stroke width value.
  function ThicknessButton(sw, propname) {
    if (!propname) propname = "thickness"
    return $(go.Shape, "LineH",
      {
        width: 16, height: 16, strokeWidth: sw,
        margin: 1, background: "transparent",
        mouseEnter: (e, shape) => shape.background = "dodgerblue",
        mouseLeave: (e, shape) => shape.background = "transparent",
        click: ClickFunction(propname, sw), contextClick: ClickFunction(propname, sw)
      })
  }

  // Create a context menu button for setting a data property with a stroke dash Array value.
  function DashButton(dash, propname) {
    if (!propname) propname = "dash"
    return $(go.Shape, "LineH",
      {
        width: 24, height: 16, strokeWidth: 2,
        strokeDashArray: dash,
        margin: 1, background: "transparent",
        mouseEnter: (e, shape) => shape.background = "dodgerblue",
        mouseLeave: (e, shape) => shape.background = "transparent",
        click: ClickFunction(propname, dash), contextClick: ClickFunction(propname, dash)
      })
  }

  function StrokeOptionsButtons() {  // used by multiple context menus
    return [
      $("ContextMenuButton",
        $(go.Panel, "Horizontal",
          ThicknessButton(1), ThicknessButton(2), ThicknessButton(3), ThicknessButton(4)
        )
      ),
      $("ContextMenuButton",
        $(go.Panel, "Horizontal",
          DashButton(null), DashButton([2, 4]), DashButton([4, 4])
        )
      )
    ]
  }

  // Node context menu

  function FigureButton(fig, propname) {
    if (!propname) propname = "figure"
    return $(go.Shape,
      {
        width: 32, height: 32, scale: 0.5, fill: "lightgray", figure: fig,
        margin: 1, background: "transparent",
        mouseEnter: (e, shape) => shape.fill = "dodgerblue",
        mouseLeave: (e, shape) => shape.fill = "lightgray",
        click: ClickFunction(propname, fig), contextClick: ClickFunction(propname, fig)
      })
  }

  myDiagram.nodeTemplate.contextMenu =
    $("ContextMenu",
      $("ContextMenuButton",
        $(go.Panel, "Horizontal",
          FigureButton("Rectangle"), FigureButton("RoundedRectangle"), FigureButton("Ellipse"), FigureButton("Diamond")
        )
      ),
      
      
      LightFillButtons(),
      DarkColorButtons(),
      StrokeOptionsButtons()
    )


  // Group template

  myDiagram.groupTemplate =
    $(go.Group, "Spot",
      {
        layerName: "Background",
        ungroupable: true,
        locationSpot: go.Spot.Center,
        selectionObjectName: "BODY",
        computesBoundsAfterDrag: true,  // allow dragging out of a Group that uses a Placeholder
        handlesDragDropForMembers: true,  // don't need to define handlers on Nodes and Links
        mouseDrop: (e, grp) => {  // add dropped nodes as members of the group
          var ok = grp.addMembers(grp.diagram.selection, true)
          if (!ok) grp.diagram.currentTool.doCancel()
        },
        avoidable: false
      },
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
      $(go.Panel, "Auto",
        { name: "BODY" },
        $(go.Shape,
          {
            parameter1: 10,
            fill: "white", strokeWidth: 2,
            portId: "", cursor: "pointer",
            fromLinkable: true, toLinkable: true,
            fromLinkableDuplicates: true, toLinkableDuplicates: true,
            fromSpot: go.Spot.AllSides, toSpot: go.Spot.AllSides
          },
          new go.Binding("fill"),
          new go.Binding("stroke", "color"),
          new go.Binding("strokeWidth", "thickness"),
          new go.Binding("strokeDashArray", "dash")),
        $(go.Placeholder,
          { background: "transparent", margin: 10 })
      ),
      $(go.TextBlock,
        {
          alignment: go.Spot.Top, alignmentFocus: go.Spot.Bottom,
          font: "bold 12pt sans-serif", editable: true
        },
        new go.Binding("text"),
        new go.Binding("stroke", "color"))
    )

  myDiagram.groupTemplate.selectionAdornmentTemplate =
    $(go.Adornment, "Spot",
      $(go.Panel, "Auto",
        $(go.Shape, { fill: null, stroke: "dodgerblue", strokeWidth: 3 }),
        $(go.Placeholder, { margin: 1.5 })
      ),
      CMButton({ alignment: new go.Spot(1, 0) })
    )

  myDiagram.groupTemplate.contextMenu =
    $("ContextMenu",
      LightFillButtons(),
      DarkColorButtons(),
      StrokeOptionsButtons()
    )


  // Link template

  myDiagram.linkTemplate =
    $(go.Link,
      {
        layerName: "Foreground",
        routing: go.Link.AvoidsNodes, corner: 10,
        toShortLength: 4,  // assume arrowhead at "to" end, need to avoid bad appearance when path is thick
        relinkableFrom: true, relinkableTo: true,
        reshapable: true, resegmentable: true
      },
     

      new go.Binding("fromSpot", "fromSpot", go.Spot.parse),
      new go.Binding("toSpot", "toSpot", go.Spot.parse),
      new go.Binding("fromShortLength", "dir", dir => dir === 2 ? 4 : 0),
      new go.Binding("toShortLength", "dir", dir => dir >= 1 ? 4 : 0),
      new go.Binding("points").makeTwoWay(),  // TwoWay due to user reshaping with LinkReshapingTool
      $(go.Shape, { strokeWidth: 2 },
        new go.Binding("stroke", "color"),
        new go.Binding("strokeWidth", "thickness"),
        new go.Binding("strokeDashArray", "dash")),
      $(go.Shape, { fromArrow: "Backward", strokeWidth: 0, scale: 4/3, visible: false },
        new go.Binding("visible", "dir", dir => dir === 2),
        new go.Binding("fill", "color"),
        new go.Binding("scale", "thickness", t => (2+t)/3)),
      $(go.Shape, { toArrow: "Standard", strokeWidth: 0, scale: 4/3 },
        new go.Binding("visible", "dir", dir => dir >= 1),
        new go.Binding("fill", "color"),
        new go.Binding("scale", "thickness", t => (2+t)/3)),
      $(go.TextBlock,
        { alignmentFocus: new go.Spot(0, 1, -4, 0), editable: true },
        new go.Binding("text").makeTwoWay(),  // TwoWay due to user editing with TextEditingTool
        new go.Binding("stroke", "color"))
    )
  $(
    go.Overview,
    "myOverviewDiv", // the HTML DIV element for the Overview
    { observed: myDiagram, contentAlignment: go.Spot.Center }
  )
  myDiagram.nodeTemplatePalette = $(
    go.Node,
    "Auto",
    // $(
    //   go.Shape,
    //   "Circle",
    //   { fill: "transparent", strokeWidth: 0, width: 60, height: 60 },
    //   new go.Binding("fill", "geo", 'geometry')
    // ),
    // $(go.Shape,
    //   { 
    //     // geometry: go.Geometry.parse("M120 0 L80 80 0 50z"),
    //     fill: "green", background: "whitesmoke",
    //     width:60, height: 60,
    //     stroke: "orange", strokeWidth: 2 },
    //     new go.Binding("geometry", "geo")
    //     ),
    // $(go.Shape,
    //   { margin: 3, fill: '#000', strokeWidth: 0 },
    //   new go.Binding("geometry", "geo", geoFunc)),
    $(go.Shape,
          { name: "SHAPE", fill: "lightgray", strokeWidth: 1, stroke: '#999', desiredSize: new go.Size(40, 40) },
          new go.Binding("geometryString", "geo").makeTwoWay()),
    $(
      go.Picture,
      { margin: 0, width: 40, height: 40 },
      new go.Binding("source")
    )
  )
  
  
  myPalette = $(go.Palette, "myPaletteDiv2");
  myPalette.nodeTemplate = myDiagram.nodeTemplatePalette;
  myPalette.model = new go.GraphLinksModel(shapesArray)


  myDiagram.linkTemplate.selectionAdornmentTemplate =
    $(go.Adornment,  // use a special selection Adornment that does not obscure the link path itself
      $(go.Shape,
        { // this uses a pathPattern with a gap in it, in order to avoid drawing on top of the link path Shape
          isPanelMain: true,
          stroke: "transparent", strokeWidth: 6,
          pathPattern: makeAdornmentPathPattern(2)  // == thickness or strokeWidth
        },
        new go.Binding("pathPattern", "thickness", makeAdornmentPathPattern)),
      CMButton({ alignmentFocus: new go.Spot(0, 0, -6, -4) })
    )
  function animateFadeDown(e: any) {
    var diagram = e.diagram;
    var animation = new go.Animation();
    animation.isViewportUnconstrained = true; // So Diagram positioning rules let the animation start off-screen
    animation.easing = go.Animation.EaseOutExpo;
    animation.duration = 900;
    // Fade "down", in other words, fade in from above
    animation.add(
      diagram,
      "position",
      diagram.position.copy().offset(0, 200),
      diagram.position
    );
    animation.add(diagram, "opacity", 0, 1);
    animation.start();
  }
  function makeAdornmentPathPattern(w) {
    return $(go.Shape,
      {
        stroke: "dodgerblue", strokeWidth: 2, strokeCap: "square",
        geometryString: "M0 0 M4 2 H3 M4 " + (w+4).toString() + " H3"
      })
  }

  // Link context menu
  // All buttons in context menu work on both click and contextClick,
  // in case the user context-clicks on the button.
  // All buttons modify the link data, not the Link, so the Bindings need not be TwoWay.

  function ArrowButton(num) {
    var geo = "M0 0 M16 16 M0 8 L16 8  M12 11 L16 8 L12 5"
    if (num === 0) {
      geo = "M0 0 M16 16 M0 8 L16 8"
    } else if (num === 2) {
      geo = "M0 0 M16 16 M0 8 L16 8  M12 11 L16 8 L12 5  M4 11 L0 8 L4 5"
    }
    return $(go.Shape,
      {
        geometryString: geo,
        margin: 2, background: "transparent",
        mouseEnter: (e, shape) => shape.background = "dodgerblue",
        mouseLeave: (e, shape) => shape.background = "transparent",
        click: ClickFunction("dir", num), contextClick: ClickFunction("dir", num)
      })
  }

  function AllSidesButton(to) {
    var setter = (e, shape) => {
        e.handled = true
        e.diagram.model.commit(m => {
          var link = shape.part.adornedPart
          m.set(link.data, (to ? "toSpot" : "fromSpot"), go.Spot.stringify(go.Spot.AllSides))
          // re-spread the connections of other links connected with the node
          // (to ? link.toNode : link.fromNode).invalidateConnectedLinks()
        })
      }
    return $(go.Shape,
      {
        width: 12, height: 12, fill: "transparent",
        mouseEnter: (e, shape) => shape.background = "dodgerblue",
        mouseLeave: (e, shape) => shape.background = "transparent",
        click: setter, contextClick: setter
      })
  }

  function SpotButton(spot, to) {
    var ang = 0
    var side = go.Spot.RightSide
    if (spot.equals(go.Spot.Top)) { ang = 270; side = go.Spot.TopSide }
    else if (spot.equals(go.Spot.Left)) { ang = 180; side = go.Spot.LeftSide }
    else if (spot.equals(go.Spot.Bottom)) { ang = 90; side = go.Spot.BottomSide }
    if (!to) ang -= 180
    var setter = (e, shape) => {
        e.handled = true
        e.diagram.model.commit(m => {
          var link = shape.part.adornedPart
          m.set(link.data, (to ? "toSpot" : "fromSpot"), go.Spot.stringify(side))
          // re-spread the connections of other links connected with the node
          // (to ? link.toNode : link.fromNode).invalidateConnectedLinks()
        })
      }
    return $(go.Shape,
      {
        alignment: spot, alignmentFocus: spot.opposite(),
        geometryString: "M0 0 M12 12 M12 6 L1 6 L4 4 M1 6 L4 8",
        angle: ang,
        background: "transparent",
        mouseEnter: (e, shape) => shape.background = "dodgerblue",
        mouseLeave: (e, shape) => shape.background = "transparent",
        click: setter, contextClick: setter
      })
  }

  myDiagram.linkTemplate.contextMenu =
    $("ContextMenu",
      DarkColorButtons(),
      StrokeOptionsButtons(),
      $("ContextMenuButton",
        $(go.Panel, "Horizontal",
          ArrowButton(0), ArrowButton(1), ArrowButton(2)
        )
      ),
      $("ContextMenuButton",
        $(go.Panel, "Horizontal",
          $(go.Panel, "Spot",
            AllSidesButton(false),
            SpotButton(go.Spot.Top, false), SpotButton(go.Spot.Left, false), SpotButton(go.Spot.Right, false), SpotButton(go.Spot.Bottom, false)
          ),
          $(go.Panel, "Spot",
            { margin: new go.Margin(0, 0, 0, 2) },
            AllSidesButton(true),
            SpotButton(go.Spot.Top, true), SpotButton(go.Spot.Left, true), SpotButton(go.Spot.Right, true), SpotButton(go.Spot.Bottom, true)
          )
        )
      )
    )
load()
}

const hideContextMenu = (shape: any) => {
  var cxElement = document.getElementById("contextMenu") as HTMLElement;
  cxElement.classList.remove("show-menu");
  if (!shape) return;
  myDiagram.startTransaction();
  let nodedata: any = {
    text: "项目名称",
    shape: shape.shape,
    source: shape.source,
  }

  // const $ = go.GraphObject.make
  //  let svg = {
  //             geometryString: go.Geometry.fillPath("M0 0 L20 20 L20 0"),
  //             stroke: "#BDBDBD",
  //             fill: "lightgreen",
  //             strokeWidth: 2,
  //             desiredSize: new go.Size(80, 120),
  //           }
  // myDiagram.add(
  //   $(go.Part, "Auto",
  //       $(go.Shape,
  //         svg)
  //   ))
  if(shape.geo) {
    nodedata = {
      text: '项目名称',
      geo: shape.geo,
      shape: shape.shape,
    }
  }
  myDiagram.model.addNodeData(nodedata);
  console.log(nodedata,'nodedata');
  
  var newnode = myDiagram.findNodeForData(nodedata);
  if (newnode !== null) newnode.location = loc;
  if (fromNode) {
    //如果有父节点，新建连线
    var linkdata = { from: fromNode.data.key, to: nodedata.key };
    myDiagram.model.addLinkData(linkdata);
  }

  myDiagram.commitTransaction("added new node and link");
  loc = null;
  canvasPos = null;
}
const save = () => {
  console.log(myDiagram.model.toJson(),'myDiagram.model.toJson()')
  myDiagram.isModified = false
}
const load = () => {
  myDiagram.model = go.Model.fromJson(obj.nodedata)
  // myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value)
}
onMounted(async () => {
  await init()
  initData()
})

</script>

<style lang="scss" scoped>
.layout-center {
  height: calc(100% - 115px);
  position: relative;
}
.layout-bottom {
  height: 35px;
  background: #fff;
  border-radius: 0 0 30px 30px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 40px;
  color: #6f6d9d;
  dd {
    cursor: pointer;
  }
}
#myOverviewDiv {
  position: absolute;
  width: 200px;
  height: 100px;
  bottom: 10px;
  right: 10px;
  // background-color: #1d1f25;
  z-index: 300; /* make sure its in front */
  border: solid 1px #7986cb;
}
#contextMenu {
  display: none;
  position: absolute;
  width: 298px;
	height: 265px;
	background-color: #fcfdff;
	box-shadow: 0px 0px 10px 0px 
		rgba(0, 0, 0, 0.05);
	border-radius: 15px;
  z-index: 999;
  overflow: hidden;
  .detail {
    float: left;
    padding: 15px 0;
    width: calc(100% - 60px);
    overflow: overlay;
    height: 100%;
    dd {
      cursor: pointer;
      margin-left: 0;
      float: left;
      height: 50px;
      width: 33.33%;
      text-align: center;
      margin: 0 0 10px 0;
    }
  }
  .tabs {
    float: left;
    width: 60px;
    box-shadow: 0px 0px 10px 0px 
		rgba(0, 0, 0, 0.05);
    height: 100%;
    overflow: overlay;
    padding-top: 20px;
    dd {
      cursor: pointer;
      margin-left: 0;
      width: 52px;
      height: 30px;
      background-color: #ffffff;
      border-radius: 11px;
      color: #545455;
      text-align: center;
      line-height: 30px;
      margin: 0 auto 10px auto;
      &.on {
        box-shadow: 0px 0px 10px 0px 
        rgba(25, 59, 250, 0.1);
        color: $qmThemeColor;
      }
    }
  }
  &.show-menu {
    display: block;
  }
}

#app {
  height: 100%;
}
#myDiagramDiv {
  width: 100%;
  height: 100%;
  position: relative;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  cursor: auto;
  overflow: hidden;
}

#myPaletteDiv {
  position: absolute;
  width: 70%;
  height: 60px;
  bottom: 73px;
  left: 15%;
  z-index: 300;
}
.menu {
  position: absolute;
  bottom: 0px;
  left: 50%;
  width: 300px;
  margin-left: -150px;
  height: 50px;
  display: flex;
  justify-content: space-between;
  z-index: 999;
}
</style>