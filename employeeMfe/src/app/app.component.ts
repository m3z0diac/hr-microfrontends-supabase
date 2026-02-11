import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { supabase } from '@payroll-system/shared';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="angular-box">
      <div class="header">
        <div style="display: flex; align-items: center; gap: 10px;">
          <h2>Employees Manager</h2>
          <span class="badge">Angular</span>
        </div>

        <button *ngIf="view === 'list'" (click)="openAddMode()" class="btn-add">
          + Add Employee
        </button>
        <button *ngIf="view !== 'list'" (click)="view = 'list'" class="btn-cancel">
          &larr; Back to List
        </button>
      </div>

      <div *ngIf="view === 'list'">
        <div *ngIf="loading">Loading data...</div>

        <table *ngIf="!loading && employees.length > 0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Job Title</th>
              <th>Department</th>
              <th style="width: 150px;">Actions</th> </tr>
          </thead>
          <tbody>
            <tr *ngFor="let emp of employees">
              <td><b>{{ emp.full_name }}</b></td>
              <td>{{ emp.job_title }}</td>
              <td>{{ emp.department || '-' }}</td>
              <td>
                <div style="display: flex; gap: 5px;">
                  <button (click)="openEditMode(emp)" class="btn-sm btn-edit">
                    ✎ Edit
                  </button>
                  <button (click)="deleteEmployee(emp.id)" class="btn-sm btn-delete">
                    🗑 Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="!loading && employees.length === 0" class="empty-state">
          No employees found.
        </div>
      </div>

      <div *ngIf="view === 'form'" class="form-container">
        <h3>{{ isEditing ? 'Edit Employee' : 'New Employee' }}</h3>

        <form (ngSubmit)="saveEmployee()">
          <div class="form-group">
            <label>Full Name</label>
            <input [(ngModel)]="currentEmployee.full_name" name="full_name" required placeholder="Name">
          </div>

          <div class="form-group">
            <label>Job Title</label>
            <input [(ngModel)]="currentEmployee.job_title" name="job_title" required placeholder="Job Title">
          </div>

          <div class="form-group">
            <label>Department</label>
            <select [(ngModel)]="currentEmployee.department" name="department">
              <option value="">Select...</option>
              <option value="Engineering">Engineering</option>
              <option value="HR">HR</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>

          <button type="submit" [disabled]="saving" class="btn-save">
            {{ saving ? 'Saving...' : (isEditing ? 'Update Employee' : 'Save Employee') }}
          </button>
        </form>
      </div>

    </div>
  `,
  styles: [`
    .angular-box { border: 2px dashed #dd0031; padding: 20px; background: white; border-radius: 8px; margin-top: 20px; font-family: sans-serif; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .badge { background: #dd0031; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; }

    /* Buttons */
    .btn-add { background: #dd0031; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; font-weight: bold; }
    .btn-cancel { background: transparent; border: 1px solid #666; color: #666; padding: 8px 12px; border-radius: 4px; cursor: pointer; }
    .btn-save { background: #2e7d32; color: white; border: none; padding: 10px 20px; border-radius: 4px; width: 100%; font-size: 16px; cursor: pointer; }

    /* Action Buttons */
    .btn-sm { padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; }
    .btn-edit { background: #ff9800; color: white; }
    .btn-delete { background: #d32f2f; color: white; }

    /* Table */
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th { text-align: left; padding: 10px; background: #eee; border-bottom: 2px solid #ccc; }
    td { padding: 10px; border-bottom: 1px solid #eee; }

    /* Form */
    .form-container { max-width: 400px; margin: 0 auto; padding: 20px; background: #f9f9f9; border-radius: 8px; }
    .form-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; font-weight: bold; font-size: 14px; }
    input, select { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
  `],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class AppComponent implements OnInit {
  view: 'list' | 'form' = 'list';
  employees: any[] = [];
  loading = true;
  saving = false;

  // State to track if we are editing
  isEditing = false;

  // The object used for the form
  currentEmployee: any = { id: null, full_name: '', job_title: '', department: '' };

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchEmployees();
  }

  async fetchEmployees() {
    this.loading = true;
    const { data } = await supabase.from('employees').select('*').order('joined_at', { ascending: false });
    this.employees = data || [];
    this.loading = false;
    this.cdr.detectChanges();
  }

  // --- ACTIONS ---

  openAddMode() {
    this.isEditing = false;
    this.currentEmployee = { id: null, full_name: '', job_title: '', department: '' }; // Reset Form
    this.view = 'form';
  }

  openEditMode(emp: any) {
    this.isEditing = true;
    // Copy the employee data so we don't edit the table directly until saved
    this.currentEmployee = { ...emp };
    this.view = 'form';
  }

  async deleteEmployee(id: string) {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    const { error } = await supabase.from('employees').delete().eq('id', id);

    if (error) {
      alert('Error: ' + error.message);
    } else {
      this.fetchEmployees(); // Refresh list
    }
  }

  async saveEmployee() {
    this.saving = true;

    const { data: { user } } = await supabase.auth.getUser();
    const payload = {
      full_name: this.currentEmployee.full_name,
      job_title: this.currentEmployee.job_title,
      department: this.currentEmployee.department,
      user_id: user?.id
    };

    let error;

    if (this.isEditing) {
      // UPDATE EXISTING
      const res = await supabase
        .from('employees')
        .update(payload)
        .eq('id', this.currentEmployee.id);
      error = res.error;
    } else {
      // CREATE NEW
      const res = await supabase
        .from('employees')
        .insert({ ...payload, joined_at: new Date() });
      error = res.error;
    }

    if (error) {
      alert('Error: ' + error.message);
    } else {
      this.view = 'list'; // Go back to table
      this.fetchEmployees(); // Refresh data
    }

    this.saving = false;
    this.cdr.detectChanges();
  }
}
