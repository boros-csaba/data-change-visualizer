import "../styles/styles.scss";
import {
  MeshBasicMaterial,
  Mesh
} from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

let blackTextMaterial = new MeshBasicMaterial({ color: 0x000000 });
let greyTextMaterial = new MeshBasicMaterial({ color: 0x333333 });

export function createLabelForBar(item, font, barMaxWidth, barThickness, barAndLabelGap) {
    let textGeometry = new TextGeometry(item.name, {
        font: font,
        size: 12,
        height: 1,
    });

    item.label = new Mesh(textGeometry, blackTextMaterial);
    textGeometry.computeBoundingBox();
    item.label.position.x = -textGeometry.boundingBox.max.x - barMaxWidth / 2 - barAndLabelGap;
    item.labelYOffset = (barThickness - textGeometry.boundingBox.max.y) / 2 - 5;
}

export function createNumberLabelForBar(item, number, font) {
    let textGeometry = new TextGeometry(number, {
        font: font,
        size: 12,
        height: 1,
    });
    item.numberLabel = new Mesh(textGeometry, blackTextMaterial);
}

export function createDateLabel(text, font, barsAreaBottom, barMaxWidth) {
    let textGeometry = new TextGeometry(text, {
        font: font,
        size: 40,
        height: 1,
    });
    textGeometry.computeBoundingBox();
    let textMesh = new Mesh(textGeometry, greyTextMaterial); 
    textMesh.position.x = barMaxWidth / 2 - textGeometry.boundingBox.max.x / 2;
    textMesh.position.y = barsAreaBottom - textGeometry.boundingBox.max.y;
    return textMesh;
}