import { describe, test } from "@odoo/hoot";
import { testEditor } from "./_helpers/editor";
import { unformat } from "./_helpers/format";
import { BOLD_TAGS } from "./_helpers/tags";

/**
 * content of the "init" sub suite in editor.test.js
 */

describe("No orphan inline elements compatibility mode", () => {
    test("should wrap inline node inside a div baseContainer", async () => {
        await testEditor({
            contentBefore: "<p>abc</p> <p>def</p> orphan node",
            contentAfter: "<p>abc</p><p>def</p><div> orphan node</div>",
        });
    });

    test("should wrap inline node inside a div baseContainer (2)", async () => {
        await testEditor({
            contentBefore: "<p>ab</p>cd<p>ef</p>",
            contentAfter: "<p>ab</p><div>cd</div><p>ef</p>",
        });
    });

    test("should transform root <br> into a div baseContainer", async () => {
        await testEditor({
            contentBefore: "ab<br>c",
            contentAfter: "<div>ab</div><div>c</div>",
        });
    });

    test("should keep <br> if necessary", async () => {
        await testEditor({
            contentBefore: "ab<br><br>c",
            contentAfter: "<div>ab</div><div><br></div><div>c</div>",
        });
    });

    test("should keep multiple conecutive <br> if necessary", async () => {
        await testEditor({
            contentBefore: "ab<br><br><br><br>c",
            contentAfter: "<div>ab</div><div><br></div><div><br></div><div><br></div><div>c</div>",
        });
    });

    test("should transform complex <br>", async () => {
        await testEditor({
            contentBefore: 'ab<br>c<br>d<span class="keep">xxx</span>e<br>f',
            contentAfter:
                '<div>ab</div><div>c</div><div>d<span class="keep">xxx</span>e</div><div>f</div>',
        });
    });

    test("should transform complex <br> + keep li ", async () => {
        await testEditor({
            contentBefore: "ab<br>c<ul><li>d</li><li>e</li></ul> f<br>g",
            contentAfter:
                "<div>ab</div><div>c</div><ul><li>d</li><li>e</li></ul><div> f</div><div>g</div>",
        });
    });

    test("should not transform <br> inside <p>", async () => {
        await testEditor({
            contentBefore: "<p>ab<br>c</p>",
            contentAfter: "<p>ab<br>c</p>",
        });
        await testEditor({
            contentBefore: "<p>ab<br>c</p><p>d<br></p>",
            contentAfter: "<p>ab<br>c</p><p>d<br></p>",
        });
        await testEditor({
            contentBefore: "xx<p>ab<br>c</p>d<br>yy",
            contentAfter: "<div>xx</div><p>ab<br>c</p><div>d</div><div>yy</div>",
        });
    });

    test("should not transform indentation", async () => {
        await testEditor({
            contentBefore: `
<p>ab</p>  
<p>c</p>`,
            contentAfter: `
<p>ab</p>  
<p>c</p>`,
        });
    });

    test("should transform root .fa", async () => {
        await testEditor({
            contentBefore: '<p>ab</p><i class="fa fa-beer"></i><p>c</p>',
            contentAfter: '<p>ab</p><div><i class="fa fa-beer"></i></div><p>c</p>',
        });
    });

    test("should wrap a div.o_image direct child of the editable into a block", async () => {
        await testEditor({
            contentBefore: '<p>abc</p><div class="o_image"></div><p>def</p>',
            contentBeforeEdit:
                '<p>abc</p><div><div class="o_image" contenteditable="false"></div></div><p>def</p>',
            contentAfter: '<p>abc</p><div><div class="o_image"></div></div><p>def</p>',
        });
    });
});

describe("allowInlineAtRoot options", () => {
    test("should wrap inline node inside a p by default", async () => {
        await testEditor({
            contentBefore: "abc",
            contentAfter: "<div>abc</div>",
        });
    });

    test("should wrap inline node inside a p if value is false", async () => {
        await testEditor(
            {
                contentBefore: "abc",
                contentAfter: "<div>abc</div>",
            },
            { allowInlineAtRoot: false }
        );
    });

    test("should keep inline nodes unchanged if value is true", async () => {
        await testEditor({
            contentBefore: "abc",
            contentAfter: "abc",
            config: { allowInlineAtRoot: true },
        });
    });
});

describe("sanitize spans/fonts", () => {
    test("should NOT sanitize attributeless spans away", async () => {
        await testEditor({
            contentBefore: "<p><span>abc</span></p>",
            contentAfter: "<p><span>abc</span></p>",
        });
    });

    test("should NOT sanitize attributeless fonts away", async () => {
        await testEditor({
            contentBefore: "<p><font>abc</font></p>",
            contentAfter: "<p><font>abc</font></p>",
        });
    });
});

describe("list normalization", () => {
    test("should keep P in LI (regardless of class)", async () => {
        await testEditor({
            contentBefore: '<ul><li><p class="class-1">abc</p><p>def</p></li></ul>',
            contentAfter: '<ul><li><p class="class-1">abc</p><p>def</p></li></ul>',
        });
    });
    test("should keep inlines in LI", async () => {
        await testEditor({
            contentBefore: "<ul><li>abc<strong>def</strong></li></ul>",
            contentAfter: "<ul><li>abc<strong>def</strong></li></ul>",
        });
    });
    test("should wrap inlines in P to prevent mixing block and inline in LI", async () => {
        await testEditor({
            contentBefore: "<ul><li>abc<strong>def</strong><p>ghi</p></li></ul>",
            contentAfter: "<ul><li><p>abc<strong>def</strong></p><p>ghi</p></li></ul>",
        });
    });
});

describe("link normalization", () => {
    test("should move inline color from anchor to font", async () => {
        await testEditor({
            contentBefore: '<p><a href="#" style="color: #008f8c">test</a></p>',
            contentAfter:
                '<p><a href="#"><font style="color: rgb(0, 143, 140);">test</font></a></p>',
        });
    });

    test("should remove anchor color and retain font color", async () => {
        await testEditor({
            contentBefore:
                '<p><a href="#" style="color: #008f8c"><font style="color: rgb(255, 0, 0);">test</font></a></p>',
            contentAfter: '<p><a href="#"><font style="color: rgb(255, 0, 0);">test</font></a></p>',
        });
    });

    test("should handle inline color styles in multiple anchor elements", async () => {
        await testEditor({
            contentBefore:
                '<p><a href="#" style="color: #008f8c"><font style="color: rgb(255, 0, 0);">test</font></a></p><p><a href="#" style="color: #008f8c">test</a></p>',
            contentAfter:
                '<p><a href="#"><font style="color: rgb(255, 0, 0);">test</font></a></p><p><a href="#"><font style="color: rgb(0, 143, 140);">test</font></a></p>',
        });
    });
});

describe("color normalization", () => {
    test("should unwrap nested identical <font> tags with gradient (class and style same)", async () => {
        await testEditor({
            contentBefore: unformat(`
                <p><font class="text-gradient" style="background-image: linear-gradient(135deg, rgb(214, 255, 127) 0%, rgb(0, 179, 204) 100%);">
                    parent
                    <font class="text-gradient" style="background-image: linear-gradient(135deg, rgb(214, 255, 127) 0%, rgb(0, 179, 204) 100%);">child</font>
                </font></p>
            `),
            contentAfter: unformat(`
                <p><font class="text-gradient" style="background-image: linear-gradient(135deg, rgb(214, 255, 127) 0%, rgb(0, 179, 204) 100%);">parentchild</font></p>
            `),
        });
    });

    test("should unwrap nested identical <font> tags with color (class and style same)", async () => {
        await testEditor({
            contentBefore: unformat(`
                <p><font class="bg-color-1" style="color:red">
                    parent
                    <font class="bg-color-1" style="color:red">child</font>
                </font></p>
            `),
            contentAfter: unformat(`
                <p><font class="bg-color-1" style="color:red">parentchild</font></p>
            `),
        });
    });

    test("should unwrap nested <font> with same style but no class", async () => {
        await testEditor({
            contentBefore: unformat(`
                <p><font class="bg-color-1" style="color:red">
                    parent
                    <font style="color:red">child</font>
                </font></p>
            `),
            contentAfter: unformat(`
                <p><font class="bg-color-1" style="color:red">parentchild</font></p>
            `),
        });
    });

    test("should unwrap nested <font> with same class only", async () => {
        await testEditor({
            contentBefore: unformat(`
                <p><font class="bg-color-1" style="color:red">
                    parent
                    <font class="bg-color-1">child</font>
                </font></p>
            `),
            contentAfter: unformat(`
                <p><font class="bg-color-1" style="color:red">parentchild</font></p>
            `),
        });
    });

    test("should unwrap nested <font> with no class or style", async () => {
        await testEditor({
            contentBefore: unformat(`
                <p><font class="bg-color-1" style="color:red">
                    parent
                    <font>child</font>
                </font></p>
            `),
            contentAfter: unformat(`
                <p><font class="bg-color-1" style="color:red">parentchild</font></p>
            `),
        });
    });

    test("should unwrap nested <font> with same style and class as closest <font>", async () => {
        await testEditor({
            contentBefore: unformat(`
                <p><font class="bg-color-1" style="color:red">
                        parent
                        <strong>
                            text1
                            <font class="bg-color-1" style="color:red">child</font>
                            text2
                        </strong>
                </font></p>
            `),
            contentAfter: unformat(`
                <p><font class="bg-color-1" style="color:red">
                        parent<strong>text1childtext2</strong>
                </font></p>
            `),
        });
    });
});

describe("formatting normalization", () => {
    test("should unwrap nested identical bold tags", async () => {
        for (const tag of BOLD_TAGS) {
            await testEditor({
                contentBefore: `<p>a${tag(`b${tag(`c${tag(`d`)}`)}e`)}f</p>`,
                contentAfter: `<p>a${tag("bcde")}f</p>`,
            });
        }
    });

    test("should merge nested strong inside formatting tags", async () => {
        await testEditor({
            contentBefore: unformat(`
                <p>
                    <strong>
                        <em>
                            <u>
                                <s>
                                    text1
                                    <strong>text2</strong>
                                    text3
                                </s>
                            </u>
                        </em>
                    </strong>
                </p>
            `),
            contentAfter: unformat(`
                <p>
                    <strong>
                        <em>
                            <u>
                                <s>
                                    text1text2text3
                                </s>
                            </u>
                        </em>
                    </strong>
                </p>
            `),
        });
    });
});
