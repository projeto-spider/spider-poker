 <template>
  <div>
    <q-collapsible
      :icon="organization.private ? 'lock' : 'label'"
      :label="organization.display_name || organization.name"
    >
      <div
        class="item item-link item-inset-delimiter"
        @click="selectProject(project.id)"
      >
        <i class="item-primary">{{project.private ? 'lock_outline' : 'label_outline'}}</i>

        <div class="item-content">
          {{project.display_name || project.name}}
        </div>
      </div>
    </q-collapsible>
  </div>
</template>

<script src="./project-picker.js"></script>
