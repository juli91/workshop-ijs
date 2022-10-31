//todo: text editor should support undo

interface Memento {
  getContent(): any;
}

// originator is creator of mementos
interface Originator {
  save(): Memento;
  restore(memento: Memento): void;
}

class CareTaker {
  private mementos: Array<Memento> = [];
  private originator: Originator;

  constructor(originator: Originator) {
    this.originator = originator;
    this.mementos = [];
  }

  backup() {
    console.log(this.originator);
    this.mementos.push(this.originator.save());
  }

  undo(): void {
    if (!this.mementos.length) return;

    const memento = this.mementos.pop();

    console.log(memento.getContent());

    this.originator.restore(memento!);
  }
}

class TextEditorMemento implements Memento {
  private readonly content: string;
  private updatedAt: string;

  constructor(content: string) {
    this.content = content;
    this.updatedAt = new Date().toISOString();
  }

  getContent(): any {
    return this.content;
  }
}

class TextEditor implements Originator {
  private _content: string = '';
  private editable: boolean = true;

  save(): Memento {
    return new TextEditorMemento(this._content);
  }

  restore(memento: Memento): void {
    this._content = memento.getContent();
  }

  addContent(newContent: string) {
    this._content += ' ' + newContent;
  }

  highlight(word: string) {
    this._content = this._content.split(word).join(`<b>${word}</b>`);
  }

  render() {
    console.log(this._content);
  }
}

const editor = new TextEditor();
const editorCareTaker = new CareTaker(editor);

editor.addContent('some content');
editorCareTaker.backup();
editor.render();

editor.addContent('some more content');
editorCareTaker.backup();
editor.render();

editor.highlight('some');
editorCareTaker.backup();
editor.render();

editorCareTaker.undo();
editorCareTaker.undo();
editorCareTaker.undo();
