`import Ember from 'ember'`
`import TextEditorConfigComponent from '../components/text-editor-config-component'`
`import PillInsertMixin from '../mixins/pill-insert'`

TextEditorWithNonEditableConfigComponent = TextEditorConfigComponent.extend(
  PillInsertMixin,
  templateName: 'text-editor-with-non-editable-config'
)

`export default TextEditorWithNonEditableConfigComponent`
