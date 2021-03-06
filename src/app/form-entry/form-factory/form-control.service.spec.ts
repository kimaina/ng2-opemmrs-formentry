import { Injector } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { AfeFormControl, AfeFormArray, AfeFormGroup } from '../../abstract-controls-extension/control-extensions';

import { FormControlService } from './form-control.service';
import { TextInputQuestion } from '../question-models/text-input-question';
import { RepeatingQuestion } from '../question-models/repeating-question';
import { QuestionBase } from '../question-models/question-base';
import { QuestionGroup } from '../question-models/group-question';
import { ValidationFactory } from '../form-factory/validation.factory';

describe('Form Factory Control Service Tests', () => {
  let injector: Injector;
  let formControlService: FormControlService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      providers: [
        FormControlService,
        ValidationFactory
      ]
    });
    injector = getTestBed();
    formControlService = injector.get(FormControlService);

  });

  afterEach(() => {
    injector = undefined;
    formControlService = undefined;
  });

  it('is defined', () => {
    expect(FormControlService).toBeDefined();
    expect(formControlService instanceof FormControlService).toBeTruthy();
  });

  it('Should have a generateFormArray function that returns a form array', () => {
    let formArray = formControlService.generateFormArray(new RepeatingQuestion({
      type: 'repeating',
      key: 'repeating1',
      label: 'Repeated',
      questions: [
        new TextInputQuestion({
          type: 'text',
          key: 'reatingPrvi2',
          label: 'Am Repeated',
          placeholder: 'Am Repeated'
        }),
        new TextInputQuestion({
          type: 'text',
          key: 'reatingPrvi1',
          label: 'Am Repeated Second',
          placeholder: 'Am Repeated Second'
        })
      ]
    }));

    expect(formArray instanceof AfeFormArray).toBeTruthy();
  });

  it('Should have a generateControl function that returns a form control', () => {
    let control = formControlService.generateFormControl(new TextInputQuestion({
      type: 'text',
      key: 'things',
      label: 'Things You Like',
      defaultValue: 'Hello',
      placeholder: ''
    }));

    expect(control.value).toEqual('Hello');
    expect(control instanceof AfeFormControl).toBeTruthy();
  });

  it('should generate control model for a form-control type question', () => {
    let testQuestion: QuestionBase = new TextInputQuestion({
      type: 'text',
      key: 'things',
      label: 'Things You Like',
      defaultValue: 'Hello',
      placeholder: ''
    });

    let parentControl = new AfeFormGroup({});
    let createdControl = formControlService.generateFormControl(testQuestion, parentControl);

    // examine the created control
    expect(createdControl).toBeTruthy();
    expect(createdControl instanceof AfeFormControl).toBe(true);
    expect(createdControl.parent).toBe(parentControl);

    // examine the parent control
    expect(parentControl.get(testQuestion.key)).toBe(createdControl);

  });

  it('should generate control model for a form-array type question', () => {
    let testQuestion: RepeatingQuestion = new RepeatingQuestion({
      type: 'repeating',
      key: 'things',
      label: 'Things You Like',
      questions: []
    });

    let childQuestion: QuestionBase = new TextInputQuestion({
      type: 'text',
      key: 'things',
      label: 'Things You Like',
      defaultValue: 'Hello',
      placeholder: ''
    });

    testQuestion.questions.push(childQuestion);

    let parentControl = new AfeFormGroup({});
    let createdControl = formControlService.generateFormArray(testQuestion, parentControl);

    // examine the created control
    expect(createdControl).toBeTruthy();
    expect(createdControl instanceof AfeFormArray).toBe(true);
    expect(createdControl.parent).toBe(parentControl);

    // examine the parent control
    expect(parentControl.get(testQuestion.key)).toBe(createdControl);

  });

  it('should generate control model for a form-group type question', () => {
    let testQuestion: QuestionGroup = new QuestionGroup({
      type: 'group',
      key: 'things',
      label: 'Things You Like',
      questions: []
    });

    let childQuestion: QuestionBase = new TextInputQuestion({
      type: 'text',
      key: 'things',
      label: 'Things You Like',
      defaultValue: 'Hello',
      placeholder: ''
    });

    testQuestion.questions.push(childQuestion);

    let parentControl = new AfeFormGroup({});
    let createdControl = formControlService.generateFormGroupModel(testQuestion, true, parentControl);

    // examine the created control
    expect(createdControl).toBeTruthy();
    expect(createdControl instanceof AfeFormGroup).toBe(true);
    expect(createdControl.parent).toBe(parentControl);

    // examine the parent control
    expect(parentControl.get(testQuestion.key)).toBe(createdControl);

    // examine child controls

    // examine the parent control
    expect(createdControl.get(testQuestion.questions[0].key)).toBeTruthy();

  });

});
