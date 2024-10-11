import {Component, computed, signal} from '@angular/core';
import {Button} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule, NgForm} from "@angular/forms";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";

@Component({
  selector: 'app-contact',
  template: `
    <h1 class="text-center">Formulaire de contact</h1>

    @if (showForm()){
      <div class="flex justify-content-center align-items-center m-auto" style="width: 50%;">
        <form #form="ngForm" (ngSubmit)="onSave(form)" class="w-full">
          <div class="form-field">
            <label for="email">Email</label>
            <input pInputText
                   type="email"
                   id="email"
                   name="email"
                   [(ngModel)]="this.contactForm().email"
                   #emailInput="ngModel"
                   required
                   email>
          </div>
          @if((emailInput.invalid && (emailInput.dirty || emailInput.touched)) && emailInput.errors?.['required']){
            <span>Un email est requis</span>
          }
          @if((emailInput.invalid && (emailInput.dirty || emailInput.touched)) && emailInput.errors?.['email']){
            <span>Entrez une adresse email valide.</span>
          }
          <div class="form-field">
            <label for="message">Message</label>
            <textarea pInputTextarea
                      id="message"
                      name="message"
                      [(ngModel)]="this.contactForm().message"
                      #messageInput="ngModel"
                      required
                      maxlength="300">
          </textarea>
          </div>
          <span class="text-sm font-italic">Caractères restants: {{ 300 - (messageInput.value.length || 0) }}</span>
          @if ((messageInput.invalid && (messageInput.dirty || messageInput.touched)) && messageInput.errors?.['required']){
            <span>Un message est requis</span>
          }
          @if ((messageInput.invalid && (messageInput.dirty || messageInput.touched)) && messageInput.errors?.['maxlength']){
            <span>300 caractères maximum</span>
          }

          <div class="flex justify-content-between mt-3">
            <p-button type="submit" [disabled]="!form.valid" label="Envoyer" severity="success"/>
          </div>
        </form>
      </div>
    }

    @if (emailSent()){
      <div class="flex justify-content-center align-items-center m-auto text-xl text-green-500" style="width: 50%;">
        Demande de contact envoyée avec succès
      </div>
    }

  `,
  standalone: true,
    imports: [
        Button,
        DropdownModule,
        FormsModule,
        InputNumberModule,
        InputTextModule,
        InputTextareaModule
    ],
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  showForm = signal(true);
  emailSent = signal(false);
  fields = {
    email: signal(""),
    message: signal("")
  }

  contactForm = computed(() => {
    return ({
      email: this.fields.email,
      message: this.fields.message
    })
  })

  onSave(form: NgForm){
    if(form.valid){
      console.log(form.value);
      form.reset();
      this.showForm.set(false);
      this.emailSent.set(true);
    }

  }

}
