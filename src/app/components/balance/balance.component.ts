import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { BalanceService } from '../../services/balance.service';

@Component({
  selector: 'app-balance',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent implements OnInit {
  data: any;
  options: any;
  balance: any;
  groups: { id: number, name: string }[] = [];
  groupId: number = 5; // groupid
  groupName: string = '';
  totalAmount: number = 0;

  constructor(private balanceService: BalanceService) {}

  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    // Fetch initial balance for a specific group
    this.fetchBalance(this.groupId, documentStyle, textColor);

    // Fetch all groups by user
    this.balanceService.getAllGroupsByUser().subscribe(groupResponse => {
      this.groups = groupResponse.groups;
      this.totalAmount = groupResponse.totalAmount;
    });
  }

  fetchBalance(groupId: number, documentStyle: any, textColor: string): void {
    this.balanceService.getBalance(groupId).subscribe(balanceResponse => {
      this.balance = balanceResponse.data;

      this.data = {
        labels: ['Deuda', 'Pagado', 'Total'],
        datasets: [
          {
            data: [this.balance.cantDebida, this.balance.cantPagada, this.balance.amountTotal],
            backgroundColor: [
              documentStyle.getPropertyValue('--blue-500'),
              documentStyle.getPropertyValue('--yellow-500'),
              documentStyle.getPropertyValue('--green-500')
            ],
            hoverBackgroundColor: [
              documentStyle.getPropertyValue('--blue-400'),
              documentStyle.getPropertyValue('--yellow-400'),
              documentStyle.getPropertyValue('--green-400')
            ]
          }
        ]
      };

      this.options = {
        cutout: '60%',
        plugins: {
          legend: {
            labels: {
              color: textColor
            }
          }
        }
      };
    });
  }

  onGroupClick(group: { id: number, name: string }): void {
    this.groupId = group.id;
    this.groupName = group.name;

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.fetchBalance(this.groupId, documentStyle, textColor);
  }
}
