import "../styles/styles.scss";
import {
  MeshBasicMaterial,
  Mesh
} from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

export function createLabelForBar(item, font, barMaxWidth, barThickness, barAndLabelGap) {
    let textGeometry = new TextGeometry(item.name, {
        font: font,
        size: 12,
        height: 1,
    });
    let textMaterial = new MeshBasicMaterial({ color: 0x000000 });
    item.label = new Mesh(textGeometry, textMaterial);
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
    let textMaterial = new MeshBasicMaterial({ color: 0x000000 });
    item.numberLabel = new Mesh(textGeometry, textMaterial);
}

export function createDateLabel(text, font) {
    let textGeometry = new TextGeometry(text, {
        font: font,
        size: 40,
        height: 1,
    });
    let textMaterial = new MeshBasicMaterial({ color: 0x000000 });
    return new Mesh(textGeometry, textMaterial);
}