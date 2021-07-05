/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

import type {OutlineEditor} from './OutlineEditor';
import type {OutlineNode} from './OutlineNode';

import {RTL_REGEX, LTR_REGEX} from './OutlineConstants';

export const emptyFunction = () => {};

let keyCounter = 0;

export function resetRandomKey(): void {
  keyCounter = 0;
}

export function generateRandomKey(): string {
  return '' + keyCounter++;
}

// When we are dealing with setting selection on an empty text node, we
// need to apply some heuristics that alter the selection anchor. Specifically,
// if the text node is the start of a block or new line, the anchor should be in
// position 0. Otherwise, it should be in position 1. This is because we use the
// BYTE_ORDER_MARK character as a way of giving the empty text node some physical
// space so that browsers correctly insert text into them. The reason we need to
// apply heuristics around if we should use 0 or 1 is because of how we insertText.
// We let the browser natively insert text, but this can cause issues on a new block
// with things like autocorrect and the software keyboard suggestions. Conversely,
// IME input can break if the anchor is not at 1 in other cases.
export function getAdjustedSelectionOffset(anchorDOM: Node): number {
  const previousSibling = anchorDOM.previousSibling;
  return previousSibling == null || previousSibling.nodeName === 'BR' ? 0 : 1;
}

export const isArray = Array.isArray;

const NativePromise = window.Promise;

export const scheduleMicroTask: (fn: () => void) => void =
  typeof queueMicrotask === 'function'
    ? queueMicrotask
    : (fn) => NativePromise.resolve().then(fn);

export function isSelectionWithinEditor(
  editor: OutlineEditor,
  anchorDOM: null | Node,
  focusDOM: null | Node,
): boolean {
  const rootElement = editor.getRootElement();
  try {
    return (
      rootElement !== null &&
      rootElement.contains(anchorDOM) &&
      rootElement.contains(focusDOM)
    );
  } catch {
    return false;
  }
}

export function getTextDirection(text: string): 'ltr' | 'rtl' | null {
  if (RTL_REGEX.test(text)) {
    return 'rtl';
  }
  if (LTR_REGEX.test(text)) {
    return 'ltr';
  }
  return null;
}

export function isImmutableOrInertOrSegmented(node: OutlineNode): boolean {
  return node.isImmutable() || node.isInert() || node.isSegmented();
}

// This is a simplified version from environment.js, to avoid pulling in all
// the other env exports.
export const IS_SAFARI: boolean =
  typeof navigator !== 'undefined' &&
  /Version\/[\d\.]+.*Safari/.test(navigator.userAgent);